import { PLAYER_A_NAME } from "../../constant/config";
import enemyJSON from '../../data/enemy.json';
import { Boss } from "../../entities/enemies/Boss";
import { Enemy } from "../../entities/enemies/Enemy";
import { InputController } from "../../inputs/InputController";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI, TEntityConfig } from "../../types/types";
import { BandageIA } from "./BandageIA";

export class MummyIA implements IEnemyAI
{
    parent: Boss;
    scene: GameScene;
    static phase: 0 | 1 = 0;
    private phaseCount: number = 0;
    constructor(parent: Boss)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.parent.body.setAllowGravity(false);

        this.parent.damageBody.body.setEnable(false);

        this.parent.anims.play(this.parent.animList.IDLE!);

        if (this.scene.getPlayerByName(PLAYER_A_NAME).body.center.x < this.parent.body.center.x)
        {
            this.parent.setFlipX(true);
        }
    }

    execute()
    {
        const { body, buttons } = this.parent;

        const { center, blocked } = body;

        const { now } = this.scene.time;

        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

        if (player.body.bottom === body.bottom && !this.scene.isBossBattle)
        {
            this.parent.startBattle();

            this.scene.time.addEvent({
                delay: 1000,
                callback: () =>
                {
                    MummyIA.phase = 1;
                }
            });
        }

        if (MummyIA.phase === 1)
        {
            const distance = Math.abs(center.x - player.body.center.x);

            // if blocked change direction
            if (blocked.left && (distance >= 55 || body.bottom !== player.body.bottom))
            {
                buttons.left.setUp(now);

                buttons.right.setDown(now);

                return;
            }

            if (blocked.right && (distance >= 55 || body.bottom !== player.body.bottom))
            {
                buttons.right.setUp(now);

                buttons.left.setDown(now);

                return;
            }

            // if near player
            if (distance < 55 && body.bottom === player.body.bottom)
            {
                if (center.x < player.body.center.x)
                {
                    buttons.left.setUp(now);

                    buttons.right.setDown(now);

                    return;
                }

                buttons.right.setUp(now);

                buttons.left.setDown(now);

                return;
            }
        }

        if (MummyIA.phase === 1 && this.phaseCount < now)
        {
            this.addBandage(now);

            this.phaseCount = now + Phaser.Math.RND.integerInRange(3000, 6000);
        }

        // mummy start moving
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

    addBandage(now)
    {
        const inputController = InputController.getInstance();

        const enemyJSONConfig: TEntityConfig = JSON.parse(JSON.stringify(enemyJSON['bandage']));

        const bandage = new Enemy({
            scene: this.scene,
            x: this.parent.flipX ? this.parent.body.left : this.parent.body.right,
            y: this.parent.damageBody.body.center.y,
            texture: 'enemies',
            frame: 'snake_0',
            buttons: inputController.getNewButtons()
        }, enemyJSONConfig);

        bandage.setName('snake');

        bandage.setAi(new BandageIA(bandage));

        this.scene.enemiesDamageBody.push(bandage.damageBody);

        if(this.parent.flipX)
        {
            bandage.buttons.left.setDown(now);

            return;
        }

        bandage.buttons.right.setDown(now);
    }

    reset()
    {

    }
}