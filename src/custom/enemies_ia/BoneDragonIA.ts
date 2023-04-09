import { ATLAS_NAMES, PLAYERS_NAMES } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import enemyJSON from '../../data/enemy.json';
import { IEnemyAI } from "../../types/types";
import { ENEMY_NAMES } from "../../constant/character";
import { Curve } from "../../utils/Curve";
import { BoneDragonBodyIA } from "./BoneDragonBodyIA";

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
    curve: Curve;
    isStarted: boolean = false;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.originPosition = { ...parent.body.center };

        this.parent.setFlipX(true).setOrigin(0.4, 0.5);

        this.parent.body.setEnable(false);

        this.parent.body.setMaxVelocityX(0);
    }

    createVertebrae()
    {
        if (this.childs.length) return;

        for (let i = 0; i < 6; i += 1)
        {
            if (!this.parent.active || !this.scene) return;

            const enemyJSONConfig = JSON.parse(JSON.stringify(enemyJSON["bone-dragon-body"]));
            enemyJSONConfig.status.position.x = this.parent.body.center.x;
            enemyJSONConfig.status.position.y = this.parent.body.center.y;
            enemyJSONConfig.physicsProperties.acceleration = this.parent.config.physicsProperties.acceleration;
            enemyJSONConfig.config.defaultFrame = 'bone-dragon-body'

            const enemy = new Enemy({
                scene: this.scene,
                x: enemyJSONConfig.status.position.x,
                y: enemyJSONConfig.status.position.y,
                texture: ATLAS_NAMES.ENEMIES,
                frame: enemyJSONConfig.config.defaultFrame,
                buttons: this.parent.buttons
            }, enemyJSONConfig);


            enemy.setName('vertebrae' + i)
                .setActive(true)
                .setFlipX(true)
                .setAi(new BoneDragonBodyIA(enemy));

            this.childs.push(enemy);

            this.scene.customGame.enemiesDamageBody.push(enemy.damageBody);
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

        // start the dragon
        if (!this.isStarted
            && up.isUp
            && down.isUp
            && a.isUp
            && active
            && this.parent.isInsideCameraByPixels(0))
        {
            this.isStarted = true;

            this.parent.resetAllButtons();

            this.scene.enemies.forEach(enemy => {
                if(enemy.name === ENEMY_NAMES.EAGLE && enemy.active && enemy.body && !this.scene.isInsideCameraByPixels(enemy.body, 32))
                {
                    enemy.kill();
                }
            });

            this.createVertebrae();

            this.scene.tweens.add({
                duration: 1000,
                targets: this.parent,
                x: this.parent.x - 48,
                onComplete: () =>
                {
                    this.parent.body.setEnable(true);

                    up.setDown(now);

                    this.changeDirectionTime = now + 1000;

                    this.scene.enemies.forEach(enemy => {
                        if(enemy.name === ENEMY_NAMES.EAGLE && enemy.active && enemy.body && !this.scene.isInsideCameraByPixels(enemy.body, 32))
                        {
                            enemy.kill();
                        }
                    });

                    return;
                }
            });
        }

        if (!this.isStarted) return;

        // update the childs bodies
        this.childs.forEach((child, i) =>
        {
            if (!this.curve || i === 0)
            {
                this.curve = new Curve(this.childs[0], this.parent, this.childs.length + 2);
            }

            const { x, y } = this.curve.getCorrectedPoints(i);

            child.x = x;
            child.y = y;
        });

        if (center.y < this.originPosition.y - 32 && body.velocity.y < 0)
        {
            body.stop();

            up.setUp(now);
            down.setDown(now);

            this.changeDirectionTime = now + 2000;
        }

        if (up.isDown && a.isUp && this.changeDirectionTime < now )
        {
            body.stop();

            up.setUp(now);
            down.setDown(now);

            this.changeDirectionTime = now + Phaser.Math.RND.integerInRange(600, 1000);
        }

        if (down.isDown && a.isUp && this.changeDirectionTime < now )
        {
            body.stop();

            down.setUp(now);
            up.setDown(now);

            this.changeDirectionTime = now + Phaser.Math.RND.integerInRange(600, 1000);
        }

        // attack the player with fireball
        if (!this.isAttacking
            && a.isUp
            && cam.worldView.contains(center.x, center.y)
            && now > this.timeAttack)
        {
            const player = this.scene.getClosestAlivePlayer(this.parent.damageBody);

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