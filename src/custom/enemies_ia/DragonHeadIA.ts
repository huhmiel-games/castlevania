import { EPossibleState } from "../../constant/character";
import { PLAYER_A_NAME, TILE_SIZE } from "../../constant/config";
import { Enemy } from "../../entities/enemies/Enemy";
import { IEnemyIA } from "../../interfaces/interface";
import GameScene from "../../scenes/GameScene";

export class DragonHeadIA implements IEnemyIA
{
    parent: Enemy;
    scene: GameScene;
    private randomTurnBackTime: number = 0;
    private isAttacking: boolean = false;
    private timeAttack: number = 1000;

    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;
        this.parent.body.reset(this.parent.body.x + 24, this.parent.body.y);
        this.randomTurnBackTime = this.scene.time.now + 4000;
    }

    decides()
    {
        const { body, buttons } = this.parent;

        const { up, a } = buttons;

        const { center, blocked } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        const otherDragons = this.scene.enemies.filter(enemy => enemy.name === 'dragonhead' && enemy.active);

        if (this.scene.physics.world.collide(this.parent, otherDragons))
        {
            this.parent.body.setAllowGravity(false).stop();
        }
        else if (!this.parent.body.allowGravity)
        {
            this.parent.body.setAllowGravity(true);
        }

        if (!this.isAttacking && this.randomTurnBackTime < now)
        {
            this.randomTurnBackTime = now + 4000;

            this.parent.setFlipX(!this.parent.flipX);
        }

        if (!this.isAttacking && cam.worldView.contains(center.x, center.y))
        {
            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            const distance = Math.abs(center.x - player.body.center.x)

            if (distance < 200)
            {
                this.isAttacking = true;

                this.timeAttack = now + 600;
            }

            return;
        }

        // attack the player with fireball
        if (this.isAttacking
            && !a.isDown
            && cam.worldView.contains(center.x, center.y)
            && now > this.timeAttack)
        {
            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            if ((center.x > player.body.center.x && this.parent.flipX) || (center.x < player.body.center.x && !this.parent.flipX))
            {
                // attack here
                up.setDown(now);
                a.setDown(now);

                this.timeAttack = now + 600;
            }

            this.scene.time.addEvent({
                delay: 580,
                callback: () =>
                {
                    if (!this.parent.active) return;

                    const { now } = this.scene.time;

                    up.setUp(now);
                    a.setUp(now);

                    this.isAttacking = false;

                    this.timeAttack = now + 600;
                }
            });
        }
    }

    reset()
    {

    }
}
