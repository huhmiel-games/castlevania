import { EStates } from "../../constant/character";
import { PLAYERS_NAMES, TILE_SIZE } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";

export class CatIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    private isAttacking: boolean = false;
    private isReady: boolean = false;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.parent.body.checkCollision.left = false;
        this.parent.body.checkCollision.right = false;
    }

    execute()
    {
        const { body, buttons } = this.parent;

        const { left, right, b } = buttons;

        const { center } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (!this.isReady && !this.isAttacking && !cam.worldView.contains(center.x, center.y))
        {
            const player = this.scene.getClosestAlivePlayer(this.parent.damageBody);

            if (center.x > player.body.center.x)
            {
                this.parent.setFlipX(true);
            }

            this.isReady = true;

            return;
        }

        if (!this.isAttacking && cam.worldView.contains(center.x, center.y))
        {
            const player = this.scene.getClosestAlivePlayer(this.parent.damageBody);

            const distance = Math.abs(center.x - player.body.center.x)

            if (distance < 70)
            {
                this.isAttacking = true;
            }

            return;
        }

        if (this.isAttacking && cam.worldView.contains(center.x, center.y) && this.parent.stateMachine.state === EStates.IDLE)
        {
            const player = this.scene.getClosestAlivePlayer(this.parent.damageBody);

            if (center.x > player.body.center.x)
            {
                left.setDown(now);
            }
            else
            {
                right.setDown(now);
            }
        }

        if (this.isAttacking && this.parent.stateMachine.prevState === EStates.FALL)
        {
            const player = this.scene.getClosestAlivePlayer(this.parent.damageBody);

            this.parent.resetAllButtons();

            if (center.x > player.body.center.x)
            {
                left.setDown(now);
            }
            else
            {
                right.setDown(now);
            }
        }

        if (right.isDown && !this.scene.colliderLayer.getTileAtWorldXY(this.parent.body.right, this.parent.body.bottom + TILE_SIZE / 8)?.canCollide)
        {
            b.setDown(now);

            return;
        }

        if (left.isDown && !this.scene.colliderLayer.getTileAtWorldXY(this.parent.body.left, this.parent.body.bottom + TILE_SIZE / 8)?.canCollide)
        {
            b.setDown(now);

            return;
        }

        if(this.isAttacking && this.parent.isOutsideCameraByPixels(64))
        {
            this.parent.kill();
        }
    }

    reset()
    {

    }
}
