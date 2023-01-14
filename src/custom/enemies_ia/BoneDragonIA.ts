import { HEIGHT, PLAYER_A_NAME } from "../../constant/config";
import { Enemy } from "../enemies/Enemy";
import GameScene from "../../scenes/GameScene";
import enemyJSON from '../../data/enemy.json';
import { IEnemyAI } from "../../types/types";
import { PALETTE_DB32 } from "../../constant/colors";
import { DEPTH } from "../../constant/depth";

export class BoneDragonIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    speedTime: number = 0;
    changeDirectionTime: number = 0;
    childs: Enemy[] = [];
    head: Enemy | undefined;
    originPosition: { x: number; y: number; };
    isAttacking: boolean = false;
    timeAttack: number = 0;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.originPosition = { ...parent.body.center };

        this.parent.setFlipX(true);

        this.parent.body.setMaxVelocityX(0);
    }

    createVertebrae()
    {
        if (this.childs.length) return;

        for (let i = 0; i < 6; i += 1)
        {
            if (!this.parent.active || !this.scene) return;

            const enemyJSONConfig = JSON.parse(JSON.stringify(enemyJSON["bone-dragon-body"]));
            enemyJSONConfig.status.position.x = this.parent.body.center.x + ((6 - i) * 8);
            enemyJSONConfig.status.position.y = this.parent.body.center.y - ((6 - i) * 8);
            enemyJSONConfig.physicsProperties.acceleration = this.parent.config.physicsProperties.acceleration;
            enemyJSONConfig.config.defaultFrame = 'bone-dragon-body'

            const enemy = new Enemy({
                scene: this.scene,
                x: enemyJSONConfig.status.position.x,
                y: enemyJSONConfig.status.position.y,
                texture: 'enemies',
                frame: enemyJSONConfig.config.defaultFrame,
                buttons: this.parent.buttons
            }, enemyJSONConfig);

            enemy.body.setImmovable().setMaxVelocity(0).setGravityY(0).setAllowGravity(false);
            enemy.setName('vertebrae' + i)
                .setDepth(this.parent.depth - i)
                .setActive(true)
                .setFlipX(true);

            this.childs.push(enemy);

            this.scene.enemiesDamageBody.push(enemy.damageBody);
        }
    }

    execute()
    {
        const { body, buttons, active, name } = this.parent;

        const { up, down, a } = buttons;

        const { center } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (!active || this.parent.isOutsideCameraByPixels(128))
        {
            return;
        }

        if (up.isUp && down.isUp && a.isUp && active && this.parent.isInsideCameraByPixels(64) && name === 'bone-dragon')
        {
            this.parent.resetAllButtons();

            this.createVertebrae();

            up.setDown(now);

            this.changeDirectionTime = now + 1000;

            return;
        }

        name === 'bone-dragon' && this.childs.forEach((child, i) =>
        {
            const diff = this.parent.y - this.childs[0].y;

            child.y = this.parent.y - diff / Math.sqrt(Math.pow(i, 3) + 1);
        })

        if (center.y < this.originPosition.y - 80 && body.velocity.y < 0)
        {
            body.stop();

            up.setUp(now);
            down.setDown(now);

            this.changeDirectionTime = now + 2000;
        }

        if (up.isDown && a.isUp && this.changeDirectionTime < now && name === 'bone-dragon')
        {
            body.stop();

            up.setUp(now);
            down.setDown(now);

            this.changeDirectionTime = now + Phaser.Math.RND.integerInRange(600, 1000);
        }

        if (down.isDown && a.isUp && this.changeDirectionTime < now && name === 'bone-dragon')
        {
            body.stop();

            down.setUp(now);
            up.setDown(now);

            this.changeDirectionTime = now + Phaser.Math.RND.integerInRange(600, 1000);
        }

        // attack the player with fireball
        if (name === 'bone-dragon'
            && !this.isAttacking
            && a.isUp
            && cam.worldView.contains(center.x, center.y)
            && now > this.timeAttack)
        {
            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            if (Phaser.Math.Distance.BetweenPoints(center, player.damageBody.body.center) < 80 && player.body.center.x < center.x)
            {
                // attack here
                body.stop();

                this.isAttacking = true;

                down.setUp(now);
                up.setDown(now);
                a.setDown(now);

                this.scene.time.addEvent({
                    delay: 20,
                    callback: () =>
                    {
                        if (!this.parent.active) return;

                        const { now } = this.scene.time;

                        a.setUp(now);
                        up.setUp(now);


                        down.setDown(now);

                        this.isAttacking = false;

                        this.timeAttack = now + 1000;
                    }
                });
            }
            else
            {
                this.timeAttack = now + 600;
            }
        }
    }

    reset()
    {

    }
}