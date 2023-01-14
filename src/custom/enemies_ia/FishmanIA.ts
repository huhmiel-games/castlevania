import { EPossibleState } from "../../constant/character";
import { PLAYER_A_NAME, TILE_SIZE } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";

export class FishmanIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    private phase: 0 | 1 | 2 = 0; // 0 underwater 1 jump 2 walk
    private randomJumpTime: number = 0;
    private randomAttackTime: number = 0;
    private isJumping: boolean = false;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;

        if (this.randomJumpTime === 0 && this.scene.cameras.main.worldView.contains(this.parent.body.center.x, this.parent.body.center.y))
        {
            this.randomJumpTime = this.scene.time.now + Phaser.Math.RND.between(50, 5000);
        }
    }

    execute()
    {
        const { body, buttons, stateMachine } = this.parent;

        const { state, prevState } = stateMachine;

        const { left, right, up, a, b } = buttons;

        const { center, blocked } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (this.randomJumpTime === 0 && this.scene.isInsideCameraByPixels(this.parent.damageBody.body, 32))
        {
            this.randomJumpTime = now + Phaser.Math.RND.between(50, 5000);
        }

        // jump from underwater
        if (this.phase === 0
            && this.randomJumpTime !== 0
            && this.randomJumpTime < now
            && state === EPossibleState.IDLE
            && !this.isJumping
            && this.scene.colliderLayer.getTileAtWorldXY(center.x, center.y - 8)?.properties?.waterBlock === true
        )
        {
            body.reset(this.getRandomX(), body.y);

            this.isJumping = true;

            this.scene.time.addEvent({
                delay: 32,
                callback: () =>
                {
                    left.setUp(now);
                    right.setUp(now);
                    b.setDown(now);

                    this.scene.playSound(15);

                    this.phase = 1;
                }
            });

            return;
        }

        // start walking
        if (this.phase === 1
            && state === EPossibleState.IDLE
            && prevState === EPossibleState.FALL
            && blocked.down
            && this.isJumping
        )
        {
            this.isJumping = false;

            b.setUp(now);

            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            if (center.x > player.body.center.x)
            {
                left.setDown(now);
            }
            else
            {
                right.setDown(now);
            }

            this.randomAttackTime = now + Phaser.Math.RND.between(3000, 10000);

            return;
        }

        // stop jumping on top 
        if (body.top < cam.worldView.top + 32)
        {
            b.setUp(now);
        }

        // turn back if blocked
        if (blocked.left)
        {
            this.parent.resetAllButtons();

            this.killIfOutsideScreen();

            right.setDown(now);

            return;
        }

        if (blocked.right)
        {
            this.parent.resetAllButtons();

            this.killIfOutsideScreen();

            left.setDown(now);

            return;
        }

        // back to water
        if (this.phase === 1
            && this.scene.colliderLayer.getTileAtWorldXY(center.x, center.y - 8)?.properties?.waterBlock === true
            && !this.isJumping
        )
        {
            this.parent.resetAllButtons();

            this.scene.playSound(16, 0.5, true);

            this.randomJumpTime = now + Phaser.Math.RND.between(50, 5000);

            this.phase = 0;
        }

        // attack the player with fireball
        if (blocked.down
            && this.randomAttackTime > 0
            && this.randomAttackTime < now
            && !(this.scene.colliderLayer.getTileAtWorldXY(center.x, center.y - 8)?.properties?.waterBlock)
        )
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

                    this.randomAttackTime = now + Phaser.Math.RND.between(3000, 10000);
                }
            })

            up.setDown(now);
            a.setDown(now);
            return;
        }
    }

    private getRandomX()
    {
        const canView = this.scene.cameras.main.worldView;

        let rndX = Phaser.Math.RND.integerInRange(canView.left + 16, canView.right - 16);

        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

        while (Math.abs(player.body.center.x - rndX) < 24
            || !(this.scene.colliderLayer.getTileAtWorldXY(rndX, this.parent.body.y + 8)?.properties?.waterBlock)
        )
        {
            rndX = Phaser.Math.RND.integerInRange(canView.left + 16, canView.right - 16);
        }

        return rndX;
    }

    reset()
    {
        this.parent.resetAllButtons();
        this.phase = 0;
        this.isJumping = false;
        this.randomJumpTime = this.scene.time.now + Phaser.Math.RND.between(50, 5000);
        this.randomAttackTime = 0;
    }

    killIfOutsideScreen()
    {
        if (this.scene.isInsideCameraByPixels(this.parent.body, 64) === false)
        {
            this.parent.killAndRespawn();
        }
    }
}
