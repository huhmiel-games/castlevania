import { PALETTE_DB32 } from "../../constant/colors";
import { HEIGHT, HUD_EVENTS_NAMES, PLAYER_A_NAME, WIDTH } from "../../constant/config";
import { Orb } from "../../gameobjects/Orb";
import GameScene from "../../scenes/GameScene";
import { TCharacterConfig, TEntityConfig } from "../../types/types";
import { Enemy } from "./Enemy";

export class Boss extends Enemy
{
    static membersCount: number = 0;
    constructor(config: TCharacterConfig, enemyJSON: TEntityConfig)
    {
        super(config, enemyJSON);

        if(Boss.membersCount < 2)
        {
            Boss.membersCount += 1;
        }

        if(Boss.membersCount > 2)
        {
            throw new Error("Boss member count error");
        }
    }

    startBattle()
    {
        this.scene.isBossBattle = true;

        const cam = this.scene.cameras.main;

        cam.setBounds(cam.scrollX, cam.scrollY, WIDTH, HEIGHT);

        this.killEnemies();

        this.scene.physics.world.setBounds(cam.scrollX, cam.scrollY, WIDTH, HEIGHT);

        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

        player.body.setCollideWorldBounds();

        this.scene.playSong(8);
    }

    killEnemies()
    {
        this.scene.enemies.forEach(enemy =>
        {
            if (enemy.name === this.name || enemy.name === 'igor') return;

            this.scene.children.remove(enemy.damageBody);
            this.scene.children.remove(enemy);
            enemy.damageBody.destroy();
            enemy.destroy()
        });
    }

    public kill(): void
    {
        this.scene?.children.remove(this.damageBody);

        this.scene?.children.remove(this);

        this.ai.reset();
        // this.scene.enemiesDamageBody = this.scene.enemiesDamageBody.filter(elm => elm !== this.damageBody);
        // this.scene.enemies = this.scene.enemies.filter(elm => elm !== this);
        this.damageBody.destroy();
        this.destroy();
    }

    public setStatusHealthDamage(damage: number): Boss
    {
        if (!this.scene) this.destroy();

        if (this.physicsProperties.isHurt) return this;

        this.physicsProperties.isHurt = true;

        const health = this.status.health - 1;

        if (Boss.membersCount === 1)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.BOSS_HEALTH, health);
        }
        else
        {
            const bossesTotalHp = this.scene.enemies.filter(elm => elm.name === this.name)
                .map(elm => elm.status.health)
                .reduce((acc, elm) => acc + elm);

            this.scene.events.emit(HUD_EVENTS_NAMES.BOSS_HEALTH, Math.round(bossesTotalHp / 2));
        }

        if (health > 0)
        {
            this.status.setHealth(health);

            this.setTint(PALETTE_DB32.ROMAN);

            this.scene?.time.addEvent({
                delay: 100,
                repeat: 4,
                callback: () =>
                {
                    if (!this.isTinted)
                    {
                        this.setTint(PALETTE_DB32.WELL_READ)
                    }
                    else
                    {
                        this.clearTint()
                    }
                }
            })

            this.scene?.time.addEvent({
                delay: 500,
                callback: () =>
                {
                    if (!this.active) return;

                    this.physicsProperties.isHurt = false;
                }
            })

            return this;
        }

        this.status.setHealth(0);

        this.setStatusIsDead(true);

        if(Boss.membersCount <= 2)
        {
            Boss.membersCount -= 1;
        }

        this.die();

        return this;
    }

    public die(): void
    {
        if (!this.active) return;

        this.setActive(false);

        this.body.stop().setEnable(false);

        this.damageBody.setActive(false);
        this.damageBody.body.setEnable(false);

        this.resetAllButtons();

        this.setTintFill(PALETTE_DB32.BLACK);

        this.scene.events.emit('enemy-score', this.status.score);

        if(this.name === 'frank')
        {
            const igor = this.scene.children.getByName('igor');

            if(igor)
            {
                (igor as Enemy).die();
            }
        }

        for (let i = 0; i < 6; i += 1)
        {
            this.scene.time.addEvent({
                delay: 200 * i,
                callback: () =>
                {
                    const deathFlame: Phaser.GameObjects.Sprite = this.scene.enemyDeathGroup.get(this.damageBody.body.center.x, this.damageBody.body.bottom, 'enemies', 'enemy-death-1', false);

                    if (deathFlame)
                    {
                        deathFlame.setOrigin(0.5, 1);
                        deathFlame.x = this.damageBody.body.left + (i * 4);
                        deathFlame.y = this.damageBody.body.bottom + 8;
                        deathFlame.setActive(true).setVisible(true);
                        deathFlame.setDepth(this.depth - 1);

                        deathFlame.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
                        {
                            deathFlame.setActive(false).setVisible(false);
                        });

                        deathFlame.anims.play('enemy-death', true);
                    }
                    else
                    {
                        throw new Error("No death free in enemyDeathGroup");
                    }
                }
            });
        }

        this.scene.time.addEvent({
            delay: 1200,
            callback: () =>
            {
                this.setVisible(false).clearTint();

                if (Boss.membersCount === 0)
                {
                    this.scene.addOrb();

                    Boss.endBossBattle(this.scene);
                }

                this.kill();
            }
        })
    }

    public addOrb()
    {
        this.scene.addOrb();
    }

    public static endBossBattle(scene: GameScene)
    {
        scene.isBossBattle = false;

        Boss.membersCount = 0;

        scene.events.emit(HUD_EVENTS_NAMES.BOSS_HEALTH, 16);

        scene.enemies.forEach(elm =>
        {
            if (elm instanceof Enemy || elm instanceof Boss)
            {
                elm.kill();
            }
        });
    }
}