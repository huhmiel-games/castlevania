import { PLAYERS_NAMES } from "../../constant/config";
import { Boss } from "../entities/Boss";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";

export class GiantBatIA implements IEnemyAI
{
    parent: Boss;
    scene: GameScene;
    private isFlying: boolean = false;
    private phase: 0 | 1 | 2 = 0;
    private phaseCount: number = 0;
    constructor(parent: Boss)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.parent.body.setAllowGravity(false);

        this.parent.anims.play(this.parent.animList.IDLE!);
    }

    execute()
    {
        const { body, anims, animList } = this.parent;

        const { center } = body;

        const cam = this.scene.cameras.main;

        if (!cam.worldView.contains(center.x, center.y))
        {
            return;
        }

        const player = this.scene.getClosestPlayer(this.parent.damageBody);

        if (player.body.center.x > 3472 && !this.scene.isBossBattle)
        {
            this.parent.startBattle();

            this.scene.time.addEvent({
                delay: 1000,
                callback: () =>
                {
                    this.phase = 1;
                }
            });
        }

        if (this.phase === 1)
        {
            anims.play(animList.FLY!, true);

            if (!this.isFlying && this.phaseCount < 5)
            {
                this.isFlying = true;

                this.phaseCount += 1;

                const randomDestination = {
                    x: Phaser.Math.RND.integerInRange(cam.worldView.left + 64, cam.worldView.right - 64),
                    y: Phaser.Math.RND.integerInRange(cam.worldView.top + 64, cam.worldView.bottom - 64),
                }

                this.parent.body.setMaxVelocity(40, 40).setDrag(0, 0);

                this.scene.physics.accelerateTo(this.parent, randomDestination.x, randomDestination.y);

                const timer = this.scene.time.addEvent({
                    delay: 1000,
                    repeat: 1,
                    callback: () =>
                    {
                        if (!this.parent.active) return;

                        this.parent.body.setMaxVelocity(this.parent.config.physicsProperties.speed / 8);

                        if (timer.getRepeatCount() === 0)
                        {
                            this.isFlying = false;
                        }
                    }
                });
            }
        }

        if (this.phase === 1 && this.phaseCount === 5)
        {
            this.phase = 2;

            this.phaseCount = 0;
        }

        if (this.phase === 2)
        {
            if (!this.isFlying)
            {
                this.isFlying = true;

                this.parent.body.setMaxVelocity(60, 60).setDrag(0, 0);

                this.scene.physics.accelerateTo(this.parent, player.body.center.x, player.body.center.y);

                anims.timeScale = 2;

                const timer = this.scene.time.addEvent({
                    delay: 1000,
                    repeat: 1,
                    callback: () =>
                    {
                        if (!this.parent.active) return;

                        body.setAcceleration(-body.acceleration.x, -body.acceleration.y);

                        if (timer.getRepeatCount() === 0)
                        {
                            this.phase = 1;

                            this.isFlying = false;

                            anims.timeScale = 1;
                        }
                    }
                });
            }
        }
    }

    reset()
    {

    }
}