import { EPossibleState } from "../../constant/character";
import { PLAYER_A_NAME, TILE_SIZE } from "../../constant/config";
import { Enemy } from "../../entities/enemies/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";

export class FishmanIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    private randomJumpTime: number = 0;
    private randomAttackTime: number = 0;
    private hasJumped: boolean = false;
    private originPosition: number;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;
        this.originPosition = { ...parent.body.center }.y + TILE_SIZE / 2;
    }

    execute()
    {
        const { body, buttons } = this.parent;

        const { left, right, up, a, b } = buttons;

        const { center, blocked } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (!this.hasJumped && this.randomJumpTime === 0 && cam.worldView.contains(center.x, center.y))
        {
            this.randomJumpTime = now + Phaser.Math.RND.between(50, 5000);
        }

        

        // first jump
        if (!this.hasJumped && blocked.down && this.parent.isInsideCameraByPixels(128) && this.randomJumpTime < now)
        {
            this.hasJumped = true;

            this.parent.resetAllButtons();

            b.setDown(now);

            return;
        }

        // turn back if blocked
        if (this.hasJumped && blocked.left && cam.worldView.contains(center.x, center.y))
        {
            this.parent.resetAllButtons();

            right.setDown(now);

            return;
        }

        if (this.hasJumped && blocked.right && cam.worldView.contains(center.x, center.y))
        {
            this.parent.resetAllButtons();

            left.setDown(now);

            return;
        }

        // turn back if no tile on ground
        if (this.hasJumped && right.isDown && !this.scene.colliderLayer.getTileAtWorldXY(this.parent.body.right, this.parent.body.bottom + TILE_SIZE / 8)?.canCollide)
        {
            this.parent.resetAllButtons();

            left.setDown(now);

            return;
        }

        if (this.hasJumped && left.isDown && !this.scene.colliderLayer.getTileAtWorldXY(this.parent.body.left, this.parent.body.bottom + TILE_SIZE / 8)?.canCollide)
        {
            this.parent.resetAllButtons();

            right.setDown(now);

            return;
        }

        // walk to player after first jump or attack
        if (this.hasJumped
            && blocked.down
            && (
                this.parent.stateMachine.prevState === EPossibleState.FALL
                || this.parent.stateMachine.prevState === EPossibleState.SECONDARY_ATTACK
            )
        )
        {
            this.parent.resetAllButtons();

            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            if (center.x > player.body.center.x)
            {
                left.setDown(now);
            }
            else
            {
                right.setDown(now);
            }

            this.randomAttackTime = now + Phaser.Math.RND.between(3000, 20000);

            return;
        }

        // attack the player with fireball
        if (this.hasJumped && blocked.down && cam.worldView.contains(center.x, center.y) && this.randomAttackTime > 0 && this.randomAttackTime < now)
        {
            this.randomAttackTime = 0;

            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            if (center.x > player.body.center.x)
            {
                this.parent.setFlipX(true);
            }
            else
            {
                this.parent.setFlipX(false);
            }

            this.scene.time.addEvent({
                delay: 1000,
                callback: () =>
                {
                    if (!this.parent.active) return;

                    this.randomAttackTime = now + Phaser.Math.RND.between(3000, 20000);
                }
            })

            up.setDown(now);
            a.setDown(now);
            return;
        }

        // if(b.isUp && this.hasJumped && body.bottom === this.originPosition)
        // {
        //     this.hasJumped = false;
        // }
    }

    reset()
    {
        this.parent.resetAllButtons();
        this.hasJumped = false;
        this.randomJumpTime = 0;
        this.randomAttackTime = 0;
    }
}
