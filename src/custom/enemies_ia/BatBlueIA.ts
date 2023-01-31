import { PLAYERS_NAMES } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";

export class BatBlueIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    isFalling: boolean = false;
    isFlying: boolean = false;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.parent.body.setAllowGravity(false);

        this.parent.anims.play(this.parent.animList.IDLE!);
    }

    execute()
    {
        const { body, buttons, anims } = this.parent;

        const { left, right } = buttons;

        const { center } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (!cam.worldView.contains(center.x, center.y) && !this.isFalling)
        {
            return;
        }

        const player = this.scene.getPlayerByName(PLAYERS_NAMES.A);

        const distance = Phaser.Math.Distance.BetweenPoints(center, player.body.center);

        if (!this.isFalling && distance < 96 && Math.abs(player.damageBody.body.center.y - center.y) < 34)
        {
            body.setAllowGravity(true).setGravityY(800);

            anims.play(this.parent.animList.FLY!, true);

            this.isFalling = true;
        }

        if (body.bottom > player.body.top && left.isUp && right.isUp)
        {
            body.setGravityY(0).setAllowGravity(false);

            if (center.x < player.body.center.x)
            {
                right.setDown(now);
            }
            else
            {
                left.setDown(now);
            }
        }

        if (this.parent.isOutsideCameraByPixels(64) && (left.isDown || right.isDown))
        {
            this.parent.kill();
        }
    }

    reset()
    {

    }
}