import { EPossibleState } from "../../constant/character";
import { PLAYER_A_NAME, TILE_SIZE } from "../../constant/config";
import { Enemy } from "../../entities/enemies/Enemy";
import { IEnemyIA } from "../../interfaces/interface";
import GameScene from "../../scenes/GameScene";

export class RavenIA implements IEnemyIA
{
    parent: Enemy;
    scene: GameScene;
    isFalling: boolean = false;
    isFlying: boolean = false;
    flyingTimestamp: number = 0;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.parent.body.setAllowGravity(false);

        this.parent.anims.play(this.parent.animList.IDLE!);
    }

    decides()
    {
        const { body, buttons, anims } = this.parent;

        const { left, right } = buttons;

        const { center } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (!cam.worldView.contains(center.x, center.y) && !this.isFlying)
        {
            return;
        }

        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

        const distance = Phaser.Math.Distance.BetweenPoints(center, player.body.center);

        if (!this.isFlying && distance < 128 && (this.flyingTimestamp + 4000 < now || this.flyingTimestamp === 0))
        {
            if (center.x < player.body.center.x)
            {
                right.setDown(now);
            }
            else
            {
                left.setDown(now);
            }

            this.isFlying = true;

            this.flyingTimestamp = now;
        }

        if (this.isFlying && body.bottom > player.body.bottom + TILE_SIZE && this.flyingTimestamp + 2000 < now)
        {
            this.parent.resetAllButtons();

            this.isFlying = false;

            if (center.x < player.body.center.x)
            {
                this.parent.setFlipX(false);
            }
            else
            {
                this.parent.setFlipX(true);
            }
        }

        if (this.isFlying && body.bottom < player.body.top - TILE_SIZE && this.flyingTimestamp + 2000 < now)
        {
            this.parent.resetAllButtons();

            this.isFlying = false;

            if (center.x < player.body.center.x)
            {
                this.parent.setFlipX(false);
            }
            else
            {
                this.parent.setFlipX(true);
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