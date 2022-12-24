import { EPossibleState } from "../../constant/character";
import { PLAYER_A_NAME } from "../../constant/config";
import { Enemy } from "../../entities/enemies/Enemy";
import { IEnemyAI } from "../../interfaces/interface";
import GameScene from "../../scenes/GameScene";

export class SkeletonRedIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    private isDead: boolean = false;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;
    }

    decides()
    {
        const { body, buttons, stateMachine, physicsProperties } = this.parent;

        const { left, right } = buttons;

        const { center, blocked } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (this.isDead) return;

        if (physicsProperties.isHurt && !this.isDead)
        {
            this.isDead = true;

            this.parent.resetAllButtons();

            this.parent.damageBody.body.setEnable(false);

            stateMachine.transition(EPossibleState.DEATH, stateMachine.state);

            this.scene.events.emit('enemy-score', this.parent.status.score);

            this.scene.time.addEvent({
                delay: this.parent.config.resurrect,
                callback: () =>
                {
                    if (!this.parent.active) return;

                    this.parent.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
                    {
                        if (!this.parent.active) return;

                        stateMachine.transition(EPossibleState.IDLE, stateMachine.state);

                        this.isDead = false;

                        this.parent.damageBody.body.setEnable(true);

                        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

                        if (player.body.center.x < center.x)
                        {
                            right.setUp(now);
                            left.setDown(now);
                        }
                        else
                        {
                            left.setUp(now);
                            right.setDown(now);
                        }
                    });

                    this.parent.anims.playReverse(this.parent.animList.DEAD!);
                }
            });
        }

        if (blocked.left && this.parent.isInsideCameraByPixels(128))
        {
            this.parent.resetAllButtons();

            right.setDown(now);

            return;
        }

        if (blocked.right && this.parent.isInsideCameraByPixels(128))
        {
            this.parent.resetAllButtons();

            left.setDown(now);

            return;
        }



        if (left.isUp && right.isUp)
        {
            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            if (this.parent.canUse(EPossibleState.LEFT) && player.damageBody.x < this.parent.body.x)
            {
                this.parent.resetAllButtons();

                buttons.left.setDown(now);

                return;
            }

            if (this.parent.canUse(EPossibleState.RIGHT) && player.damageBody.x > this.parent.body.x)
            {
                this.parent.resetAllButtons();

                buttons.right.setDown(now);

                return;
            }
        }
    }

    reset()
    {

    }
}