import { PLAYERS_NAMES, TILE_SIZE } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI, TCoord } from "../../types/types";

export class SkeletonIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    private randomAttackTime: number = 0;
    private isAttacking: boolean = false;
    private distanceToPlayer: number = 1000;
    private originPosition: TCoord;
    private radius: number = 120;
    private isGoingToOriginPosition: boolean = false;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;
        this.originPosition = { ...parent.body.center };
    }

    execute()
    {
        const { body, buttons } = this.parent;

        const { left, right, up, a, b, y } = buttons;

        const { center, blocked } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (this.scene.cameras.main.getBounds().bottom < this.parent.damageBody.body.top)
        {
            this.parent.physicsProperties.isDead = true;
        }

        if (this.parent.isOutsideCameraByPixels(48) && !this.isGoingToOriginPosition)
        {
            this.parent.resetAllButtons();

            return;
        }

        const currentRadius = Math.abs(this.originPosition.x - center.x);

        const player = this.scene.getClosestAlivePlayer(this.parent.damageBody);

        this.distanceToPlayer = Phaser.Math.Distance.BetweenPoints(player.body.center, center);

        if (currentRadius > this.radius / 2
            && currentRadius < this.radius
            && this.isGoingToOriginPosition
        )
        {
            return;
        }
        else if (currentRadius < this.radius / 2
            && this.isGoingToOriginPosition
        )
        {
            this.isGoingToOriginPosition = false;
        }

        if (currentRadius > this.radius && !this.isGoingToOriginPosition)
        {
            this.isGoingToOriginPosition = true;

            if (center.x > this.originPosition.x)
            {
                this.parent.resetAllButtons();

                left.setDown(now);

                return;
            }

            if (center.x < this.originPosition.x)
            {
                this.parent.resetAllButtons();

                right.setDown(now);

                return;
            }
        }

        if (this.distanceToPlayer <= 48 && blocked.down && currentRadius < this.radius)
        {
            this.parent.resetAllButtons();

            y.setDown(now);

            if (center.x > player.body.center.x)
            {
                right.setUp(now);
                left.setDown(now);

            }
            else
            {
                left.setUp(now);
                right.setDown(now);
            }

            const chanceToJump = Phaser.Math.RND.between(0, 100);

            if (chanceToJump > 50)
            {
                b.setDown(now);
            }

            return;
        }

        // jump right
        if (!this.isAttacking
            && right.isDown
            && b.isUp
            && currentRadius < this.radius
            && (
                !this.scene.colliderLayer.getTileAtWorldXY(this.parent.body.right, this.parent.body.bottom + TILE_SIZE / 8)?.canCollide
                || blocked.right
            )
        )
        {
            b.setDown(now);

            return;
        }

        // jump left
        if (!this.isAttacking
            && left.isDown
            && b.isUp
            && currentRadius < this.radius
            && (
                !this.scene.colliderLayer.getTileAtWorldXY(this.parent.body.left, this.parent.body.bottom + TILE_SIZE / 8)?.canCollide
                || blocked.left
            )
        )
        {
            b.setDown(now);

            return;
        }

        // face the player
        if (!blocked.right
            && currentRadius < this.radius
            && blocked.down
            && body.right < player.body.left
            && this.distanceToPlayer > 80)
        {
            y.setUp(now);
        }
        if (!blocked.left
            && currentRadius < this.radius
            && blocked.down
            && body.left > player.body.right
            && this.distanceToPlayer > 80)
        {
            y.setUp(now);
        }

        // try to reach player to the left
        if (this.distanceToPlayer > 80
            && blocked.down
            && currentRadius < this.radius
            && body.left > player.body.right
        )
        {
            right.setUp(now);
            y.setUp(now);

            left.setDown(now);
        }

        // try to reach player to the right
        if (this.distanceToPlayer > 80
            && blocked.down
            && currentRadius < this.radius
            && body.right < player.body.left
        )
        {
            left.setUp(now);
            y.setUp(now);

            right.setDown(now);
        }

        // stay safe from player
        if (this.distanceToPlayer < 72
            && currentRadius < this.radius
            && center.x > player.body.center.x
            && blocked.down
        )
        {
            left.setUp(now);

            y.setDown(now);
            right.setDown(now);
        }

        // stay safe from player
        if (this.distanceToPlayer < 72
            && currentRadius < this.radius
            && center.x < player.body.center.x
            && blocked.down
        )
        {
            right.setUp(now)

            y.setDown(now);
            left.setDown(now);
        }


        if (!this.isAttacking
            && currentRadius < this.radius
            && this.randomAttackTime < now
            && this.distanceToPlayer > 72
            && this.distanceToPlayer < 160
            && cam.worldView.contains(player.body.center.x, player.body.center.y))
        {
            const chanceToAttack = Phaser.Math.RND.between(0, 100);

            this.randomAttackTime = now + Phaser.Math.RND.between(1000, 5000);

            if (chanceToAttack > 25 && a.isUp)
            {
                this.isAttacking = true;

                if (center.x > player.body.center.x)
                {
                    this.parent.setFlipX(true);
                }
                else
                {
                    this.parent.setFlipX(false);
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
                });
            }
        }
    }

    reset()
    {

    }
}