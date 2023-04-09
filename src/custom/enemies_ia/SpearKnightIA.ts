import { EStates } from "../../constant/character";
import { PLAYERS_NAMES, TILE_SIZE } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";

export class SpearKnightIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    private randomTurnBackTime: number = 0;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;
    }

    execute()
    {
        const { body, buttons } = this.parent;

        const { left, right } = buttons;

        const { center, blocked } = body;

        const { now } = this.scene.time;

        if(this.parent.isOutsideCameraByPixels(128))
        {
            return;
        }

        if (blocked.left)
        {
            this.parent.resetAllButtons();

            right.setDown(now);

            return;
        }

        if (blocked.right)
        {
            this.parent.resetAllButtons();

            left.setDown(now);

            return;
        }

        if (right.isDown && !this.scene.colliderLayer.getTileAtWorldXY(body.right, body.bottom + TILE_SIZE / 8)?.canCollide)
        {
            this.parent.resetAllButtons();

            left.setDown(now);

            return;
        }

        if (left.isDown && !this.scene.colliderLayer.getTileAtWorldXY(body.left, body.bottom + TILE_SIZE / 8)?.canCollide)
        {
            this.parent.resetAllButtons();

            right.setDown(now);

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

            this.randomTurnBackTime = now + Phaser.Math.RND.between(1000, 3000);
        }

        if(this.scene.getClosestAlivePlayer(this.parent.damageBody).stateMachine.prevState.startsWith('fall'))
        {
            const player = this.scene.getClosestAlivePlayer(this.parent.damageBody);

            if(body.bottom === player.body.bottom)
            {
                const side = center.x > player.body.center.x;

                this.parent.resetAllButtons();

                if(side === true)
                {
                    left.setDown(now);
                }
                else
                {
                    right.setDown(now);
                }
            }
        }

        if (left.isUp && right.isUp)
        {
            const player = this.scene.getClosestAlivePlayer(this.parent.damageBody);

            if (this.parent.canUse(EStates.LEFT) && player.damageBody.x < body.x)
            {
                this.parent.resetAllButtons();

                buttons.left.setDown(now);

                return;
            }

            if (this.parent.canUse(EStates.RIGHT) && player.damageBody.x > body.x)
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