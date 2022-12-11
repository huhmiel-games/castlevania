import { EPossibleState } from "../../constant/character";
import { PLAYER_A_NAME, TILE_SIZE } from "../../constant/config";
import { Enemy } from "../../entities/enemies/Enemy";
import { IEnemyIA } from "../../interfaces/interface";
import GameScene from "../../scenes/GameScene";

export class DragonHeadIA implements IEnemyIA
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
        this.parent.body.reset(this.parent.body.x + 24, this.parent.body.y);
        this.randomTurnBackTime = this.scene.time.now + Phaser.Math.RND.between(1000, 8000);
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
            this.parent.body.setAllowGravity(false);
            this.parent.body.stop();
        }
        else if(this.parent.body.allowGravity === false)
        {
            this.parent.body.setAllowGravity(true);
        }

        if (!this.isAttacking && this.randomTurnBackTime < now)
        {
            this.randomTurnBackTime = now + Phaser.Math.RND.between(1000, 8000);

            this.parent.setFlipX(!this.parent.flipX);
        }

        if (!this.isAttacking && cam.worldView.contains(center.x, center.y))
        {
            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            const distance = Math.abs(center.x - player.body.center.x)

            if (distance < 128)
            {
                this.isAttacking = true;
            }

            return;
        }

        // attack the player with fireball
        if (this.isAttacking && !a.isDown && cam.worldView.contains(center.x, center.y))
        {
            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            const distance = Phaser.Math.Distance.BetweenPoints(player, this.parent);

            if (center.x > player.body.center.x && this.parent.flipX)
            {
                // attack here
                up.setDown(now);
                a.setDown(now);

            }

            if (center.x < player.body.center.x && !this.parent.flipX)
            {
                // attack here
                up.setDown(now);
                a.setDown(now);
            }
            
            this.scene.time.addEvent({
                delay: 3000,
                callback: () => {
                    this.parent.resetAllButtons();
                    this.isAttacking = false;
                }
            })


            // this.scene.time.addEvent({
            //     delay: 1000,
            //     callback: () =>
            //     {
            //         if (!this.parent.active) return;
            //     }
            // })

            // up.setDown(now);
            // a.setDown(now);
            // return;
        }
    }

    reset()
    {

    }
}
