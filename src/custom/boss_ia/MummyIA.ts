import { ATLAS_NAMES, PLAYERS_NAMES } from "../../constant/config";
import enemyJSON from '../../data/enemy.json';
import { Boss } from "../entities/Boss";
import { Enemy } from "../entities/Enemy";
import { InputController } from "../../inputs/InputController";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI, TEntityConfig } from "../../types/types";
import { BandageIA } from "./BandageIA";
import { ENEMY_NAMES } from "../../constant/character";

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

        this.parent.setAlpha(0);

        this.parent.anims.play(this.parent.animList.IDLE!);

        if (this.scene.getClosestAlivePlayer(this.parent.damageBody).body.center.x < this.parent.body.center.x)
        {
            this.parent.setFlipX(true);
        }
    }

    execute()
    {
        const { body, buttons } = this.parent;

        const { center, blocked } = body;

        const { now } = this.scene.time;

        const { left, right } = buttons;

        const player = this.scene.getClosestAlivePlayer(this.parent.damageBody);

        if (player.body.left > 273 * 16 && !this.scene.isBossBattle)
        {
            this.scene.isBossBattle = true;

            MummyIA.phase = 0;

            this.scene.cameras.main.stopFollow().pan(280 * 16, 6 * 16, 1000);
            this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.PAN_COMPLETE, () =>
            {
                const mummies = this.scene.enemies.filter(elm => elm.name === ENEMY_NAMES.MUMMY) as Boss[];

                mummies.forEach(elm => {
                    elm.ai['phaseCount'] = now + Phaser.Math.RND.integerInRange(5000, 9000);
                })

                this.parent.startBattle();

                this.scene.tweens.add({
                    duration: 500,
                    repeat: 0,
                    targets: mummies,
                    alpha: { from: 0, to: 1 },
                    ease: Phaser.Math.Easing.Elastic
                })

                this.scene.time.addEvent({
                    delay: 1000,
                    callback: () =>
                    {
                        MummyIA.phase = 1;

                        this.scene.cameraFollowPlayer();
                    }
                });
            });
        }

        if (MummyIA.phase === 1)
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
        }

        if (MummyIA.phase === 1 && this.phaseCount < now)
        {
            this.parent.resetAllButtons();

            this.addBandage(now);

            this.phaseCount = now + Phaser.Math.RND.integerInRange(5000, 9000);
        }
        else if (MummyIA.phase === 1 && left.isUp && right.isUp)
        {
            if (center.x > player.body.center.x)
            {
                left.setUp(now);

                right.setDown(now);

                return;
            }

            right.setUp(now);

            left.setDown(now);

            return;
        }

        // mummy start moving
        if (MummyIA.phase === 1 && this.scene.isBossBattle && !this.parent.damageBody.body.enable)
        {
            this.parent.damageBody.body.setEnable(true);

            this.phaseCount = now + Phaser.Math.RND.integerInRange(5000, 9000);

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

    addBandage(now: number)
    {
        const inputController = InputController.getInstance();

        const enemyJSONConfig: TEntityConfig = JSON.parse(JSON.stringify(enemyJSON[ENEMY_NAMES.BANDAGE]));

        const bandage = new Enemy({
            scene: this.scene,
            x: this.parent.flipX ? this.parent.body.left : this.parent.body.right,
            y: this.parent.damageBody.body.center.y,
            texture: ATLAS_NAMES.ENEMIES,
            frame: 'bandage_0',
            buttons: inputController.getNewButtons()
        }, enemyJSONConfig);

        bandage.setName(ENEMY_NAMES.BANDAGE);

        bandage.setAi(new BandageIA(bandage));

        this.scene.customGame.enemiesDamageBody.push(bandage.damageBody);

        if (this.parent.flipX)
        {
            bandage.buttons.left.setDown(now);

            return;
        }

        bandage.buttons.right.setDown(now);
    }

    reset()
    {
        if (!this.scene.isBossBattle) MummyIA.phase = 0;
    }
}