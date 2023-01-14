import { EPossibleState } from "../../constant/character";
import { PLAYER_A_NAME, TILE_SIZE } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";

export class AxeKnightIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    private randomTurnBackTime: number = 0;
    private isAttacking: boolean = false;
    private randomAttackTime: number = 0;
    private distanceToPlayer: number = 1000;
    private isHighAttack: boolean = true;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;
        this.randomAttackTime = this.scene.time.now + 3000;

        if (this.parent.body.center.x > this.scene.getPlayerByName(PLAYER_A_NAME).body.center.x)
        {
            this.parent.setFlipX(true);
        }
        else
        {
            this.parent.setFlipX(false);
        }
    }

    execute()
    {
        const { body, buttons } = this.parent;

        const { left, right, up, a, y } = buttons;

        const { center, blocked } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (this.parent.isOutsideCameraByPixels(64))
        {
            return;
        }

        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

        this.distanceToPlayer = Phaser.Math.Distance.BetweenPoints(player.body.center, center);

        // react to walls
        if (!this.isAttacking && blocked.left && this.distanceToPlayer > 160)
        {
            this.parent.resetAllButtons();

            right.setDown(now);

            return;
        }

        if (!this.isAttacking && blocked.right && this.distanceToPlayer > 160)
        {
            this.parent.resetAllButtons();

            left.setDown(now);

            return;
        }

        // react to player moves
        if (this.distanceToPlayer <= 160 && y.isUp)
        {
            this.parent.resetAllButtons();

            const chanceToReactToPlayer = Phaser.Math.RND.between(0, 100);

            if (chanceToReactToPlayer > 25)
            {
                if (player.body.center.x < center.x
                    && (player.buttons.left.isDown || player.stateMachine.prevState === EPossibleState.LEFT)
                    && this.scene.colliderLayer.getTileAtWorldXY(body.left, body.bottom + TILE_SIZE / 8)?.canCollide
                )
                {
                    y.setUp(now);
                    left.setDown(now);
                }

                if (player.body.center.x < center.x
                    && (player.buttons.right.isDown || player.stateMachine.prevState === EPossibleState.RIGHT)
                    && this.scene.colliderLayer.getTileAtWorldXY(body.right, body.bottom + TILE_SIZE / 8)?.canCollide
                )
                {
                    y.setDown(now);
                    right.setDown(now);
                }

                if (player.body.center.x > center.x
                    && (player.buttons.left.isDown || player.stateMachine.prevState === EPossibleState.LEFT)
                    && this.scene.colliderLayer.getTileAtWorldXY(body.left, body.bottom + TILE_SIZE / 8)?.canCollide
                )
                {
                    y.setDown(now);
                    left.setDown(now);
                }

                if (player.body.center.x > center.x
                    && (player.buttons.right.isDown || player.stateMachine.prevState === EPossibleState.RIGHT)
                    && this.scene.colliderLayer.getTileAtWorldXY(body.right, body.bottom + TILE_SIZE / 8)?.canCollide
                )
                {
                    y.setUp(now);
                    right.setDown(now);
                }
            }

            this.randomTurnBackTime = now + Phaser.Math.RND.between(1000, 3000);
        }

        // don't fall from platform
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

        // random turn back
        if (!this.isAttacking && this.randomTurnBackTime < now && this.distanceToPlayer > 160)
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

        // attacks
        if (!this.isAttacking
            && this.randomAttackTime < now
            && this.distanceToPlayer < 160
            && cam.worldView.contains(player.body.center.x, player.body.center.y))
        {
            const chanceToAttack = Phaser.Math.RND.between(0, 100);

            this.randomAttackTime = now + 3000;

            if (chanceToAttack > 25 && a.isUp)
            {
                this.isAttacking = true;

                if (this.isHighAttack)
                {
                    this.parent.config.secondaryAttackOffsetY = 12;

                    this.isHighAttack = false;
                }
                else
                {
                    this.parent.config.secondaryAttackOffsetY = -8;

                    this.isHighAttack = true;
                }

                this.parent.resetAllButtons();

                up.setDown(now);
                a.setDown(now);

                this.scene.time.addEvent({
                    delay: 100,
                    callback: () =>
                    {
                        this.parent.resetAllButtons();

                        this.isAttacking = false;
                    }
                })
            }
        }
    }

    reset()
    {

    }
}