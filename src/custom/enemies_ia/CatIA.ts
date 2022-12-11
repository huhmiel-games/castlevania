import { EPossibleState } from "../../constant/character";
import { PLAYER_A_NAME, TILE_SIZE } from "../../constant/config";
import { Enemy } from "../../entities/enemies/Enemy";
import { IEnemyIA } from "../../interfaces/interface";
import GameScene from "../../scenes/GameScene";

export class CatIA implements IEnemyIA
{
    parent: Enemy;
    scene: GameScene;
    randomTurnBackTime: number = 0;
    isAttacking: boolean = false;
    isReady: boolean = false;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;
    }

    decides()
    {
        const { body, buttons } = this.parent;

        const { left, right, b } = buttons;

        const { center, blocked } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (!this.isReady && !this.isAttacking && !cam.worldView.contains(center.x, center.y))
        {
            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            if (center.x > player.body.center.x)
            {
                this.parent.setFlipX(true);
            }

            this.isReady = true;

            return;
        }

        if (!this.isAttacking && cam.worldView.contains(center.x, center.y))
        {
            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            const distance = Math.abs(center.x - player.body.center.x)

            if (distance < 70)
            {
                this.isAttacking = true;
            }

            return;
        }

        if (this.isAttacking && cam.worldView.contains(center.x, center.y) && this.parent.stateMachine.state === EPossibleState.IDLE)
        {
            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            if (center.x > player.body.center.x)
            {
                left.setDown(now);
            }
            else
            {
                right.setDown(now);
            }
        }

        if (this.isAttacking && this.parent.stateMachine.prevState === EPossibleState.FALL)
        {
            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

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

        if(this.isAttacking && this.parent.isOutsideScreenByPixels(64))
        {
            this.parent.kill();
        }
    }

    reset()
    {

    }
}
