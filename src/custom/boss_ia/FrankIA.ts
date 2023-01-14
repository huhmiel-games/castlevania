import { PLAYER_A_NAME } from "../../constant/config";
import { Boss } from "../entities/Boss";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";

export class FrankIA implements IEnemyAI
{
    parent: Boss;
    scene: GameScene;
    static phase: 0 | 1 = 0;
    private phaseCount: number = 0;
    private randomTurnBackTime: number = 0;
    constructor(parent: Boss)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.parent.body.setAllowGravity(false);

        this.parent.damageBody.body.setEnable(false);

        this.parent.anims.play(this.parent.animList.IDLE!);

        this.parent.setFlipX(true);
    }

    execute()
    {
        const { body, buttons } = this.parent;

        const { center, blocked } = body;

        const { now } = this.scene.time;

        const { left, right } = buttons;

        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

        if (player.body.left > 519 * 16 && !this.scene.isBossBattle)
        {
            this.parent.startBattle();

            this.scene.time.addEvent({
                delay: 2000,
                callback: () =>
                {
                    FrankIA.phase = 1;
                }
            });
        }

        if (FrankIA.phase === 1)
        {
            const distance = Math.abs(center.x - player.body.center.x);



            // if blocked change direction
            if (blocked.left && (distance >= 55 || body.bottom !== player.body.bottom))
            {
                left.setUp(now);

                right.setDown(now);

                return;
            }

            if (blocked.right && (distance >= 55 || body.bottom !== player.body.bottom))
            {
                right.setUp(now);

                left.setDown(now);

                return;
            }

            // if near player
            if (distance < 55 && body.bottom === player.body.bottom)
            {
                if (center.x < player.body.center.x)
                {
                    left.setUp(now);

                    right.setDown(now);

                    return;
                }

                right.setUp(now);

                left.setDown(now);

                return;
            }

            if (this.randomTurnBackTime < now)
            {
                const chanceToturnBack = Phaser.Math.RND.between(0, 100);

                if (chanceToturnBack > 25 && left.isDown)
                {
                    this.parent.resetAllButtons();

                    right.setDown(now);
                }
                else if (chanceToturnBack > 25 && right.isDown)
                {
                    this.parent.resetAllButtons();

                    left.setDown(now);
                }

                this.randomTurnBackTime = now + Phaser.Math.RND.between(2000, 6000);
            }
        }

        if (FrankIA.phase === 1 && this.phaseCount < now)
        {
            this.phaseCount = now + Phaser.Math.RND.integerInRange(3000, 6000);
        }

        // frank start moving
        if (this.scene.isBossBattle && !this.parent.damageBody.body.enable)
        {
            this.parent.damageBody.body.setEnable(true);

            this.phaseCount = now + Phaser.Math.RND.integerInRange(3000, 6000);

            if (center.x > player.body.center.x)
            {
                buttons.left.setDown(now);
            }
            else
            {
                buttons.right.setDown(now);
            }
        }
    }

    reset()
    {

    }
}