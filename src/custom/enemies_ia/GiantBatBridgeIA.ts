import { PLAYER_A_NAME } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";

export class GiantBatBridgeIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    private isFlying: boolean = false;
    private chaseCount: number = 0;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.parent.body.setAllowGravity(false);

        this.parent.anims.play(this.parent.animList.FLY!);
    }

    execute()
    {
        const { body, anims, animList, damageBody } = this.parent;

        const { center } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (!this.isFlying && !cam.worldView.contains(center.x, center.y))
        {
            return;
        }

        this.parent.anims.play(this.parent.animList.FLY!, true);

        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

        const distance = Phaser.Math.Distance.BetweenPoints(player.damageBody.body.center, damageBody.body.center);

        if (!this.isFlying && distance < 64)
        {
            this.isFlying = true;

            this.chaseCount = now;
        }

        if (this.isFlying && this.chaseCount < now)
        {
            this.chaseCount = now + 1500;

            this.parent.body.setMaxVelocity(this.parent.config.physicsProperties.speed / 2);

            this.scene.physics.accelerateTo(this.parent, player.body.left - 16, player.body.center.y);

            const timer = this.scene.time.addEvent({
                delay: 1480,
                repeat: 0,
                callback: () =>
                {
                    if (!this.parent.active) return;

                    this.parent.body.setMaxVelocity(this.parent.config.physicsProperties.speed / 8);
                }
            });
        }
    }

    reset()
    {

    }
}