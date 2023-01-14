import { PALETTE_DB32 } from "../../constant/colors";
import { HEIGHT, HUD_EVENTS_NAMES, PLAYER_A_NAME, WIDTH } from "../../constant/config";
import { addDraculaHead, addFinalBoss } from "../addEnemies";
import GameScene from "../../scenes/GameScene";
import SaveLoadService from "../../services/SaveLoadService";
import { RangedWeapon, TCharacterConfig, TEntityConfig } from "../../types/types";
import { Enemy } from "./Enemy";

export class Boss extends Enemy
{
    constructor(config: TCharacterConfig, enemyJSON: TEntityConfig)
    {
        super(config, enemyJSON);
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

        this.damageBody.destroy();
        this.destroy();
    }

    public setStatusHealthDamage(damage: number): Boss
    {
        if (!this.scene) this.destroy();

        if (this.physicsProperties.isHurt) return this;

        this.physicsProperties.isHurt = true;

        const health = this.status.health - 1;

        if (this.getRemainingActiveBosses() === 1)
        {
            if (this.name === 'dracula2')
            {
                this.scene.events.emit(HUD_EVENTS_NAMES.BOSS_HEALTH, Math.ceil(health / 2));
            }
            else
            {
                this.scene.events.emit(HUD_EVENTS_NAMES.BOSS_HEALTH, health);
            }
        }
        else
        {
            const bossesTotalHp = this.scene.enemies.filter(elm => elm.active && elm.name === this.name)
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

        SaveLoadService.setEnemiesDeathCount();

        SaveLoadService.setSavedGameTime(this.scene);

        this.scene.events.emit('enemy-score', this.status.score);

        if (this.name === 'frank')
        {
            const igor = this.scene.children.getByName('igor');

            if (igor)
            {
                (igor as Enemy).die();
            }
        }

        if (this.name === 'dracula')
        {
            this.setActive(true);

            this.clearTint();

            addDraculaHead(this.scene, this.body.center.x, this.damageBody.body.top, this.flipX);

            this.anims.play(this.animList.DEAD!);

            return;
        }

        for (let i = 0; i < 6; i += 1)
        {
            this.scene.time.addEvent({
                delay: 200 * i,
                callback: () =>
                {
                    const deathFlame: Phaser.GameObjects.Sprite = this.scene?.enemyDeathGroup.get(this.damageBody.body.center.x, this.damageBody.body.bottom, 'enemies', 'enemy-death-1', false);

                    if (deathFlame)
                    {
                        deathFlame.setOrigin(0.5, 1);
                        deathFlame.x = (this.damageBody.body.left - this.width / 12) + (i * this.width / 12);
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
                },
                callbackScope: this
            });
        }

        for (let i = 0; i < 6; i += 1)
        {
            this.scene.time.addEvent({
                delay: 200 * i,
                callback: () =>
                {
                    const deathFlame: Phaser.GameObjects.Sprite = this.scene?.enemyDeathGroup.get(this.damageBody.body.center.x, this.damageBody.body.bottom, 'enemies', 'enemy-death-1', false);

                    if (deathFlame)
                    {
                        deathFlame.setOrigin(0.5, 1);
                        deathFlame.x = (this.damageBody.body.left - this.width / 12) + (i * this.width / 12);
                        deathFlame.y = this.damageBody.body.center.y - 8;
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
                },
                callbackScope: this
            });
        }

        this.scene.time.addEvent({
            delay: 1200,
            callback: () =>
            {
                this.setVisible(false).clearTint();

                if (this.getRemainingActiveBosses() === 0 && this.scene)
                {
                    if (this.name === 'dracula')
                    {
                        addDraculaHead(this.scene, this.body.center.x, this.damageBody.body.top, this.flipX);

                        this.anims.play(this.animList.DEAD!);
                    }
                    else
                    {
                        this.scene.addOrb();

                        Boss.endBossBattle(this.scene);
                    }
                }

                this.kill();
            }
        })
    }

    private getRemainingActiveBosses(): number
    {
        if (!this.scene) return 0;
        return this.scene.enemies.filter(enemy => enemy instanceof Boss && enemy.active).length;
    }

    public static endBossBattle(scene: GameScene)
    {
        scene.isBossBattle = false;

        // scene.events.emit(HUD_EVENTS_NAMES.BOSS_HEALTH, 16);

        scene.enemies.forEach(elm =>
        {
            if (elm instanceof Enemy || elm instanceof Boss)
            {
                elm.kill();
            }
        });
    }

    public secondaryAttack(): void
    {
        const { ammo } = this.status;

        if (ammo === 0) return;

        for (let i = 0; i < 3; i += 1)
        {
            const weapon = this.secondaryWeaponGroup.getFirstDead(false, this.body.x, this.body.y, undefined, undefined, true) as RangedWeapon;

            if (!weapon)
            {
                return;
            }

            weapon.parent = this;

            weapon.setDepth(this.depth - 1);

            weapon.attack(this.config?.secondaryAttackOffsetY || 8);

            this.status.setAmmo(ammo - 1);
        }
    }
}
