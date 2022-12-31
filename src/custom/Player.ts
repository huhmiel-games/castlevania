import { EPossibleState } from "../constant/character";
import { HUD_EVENTS_NAMES, PLAYER_A_NAME, SCENES_NAMES, TILE_SIZE } from "../constant/config";
import { DEPTH } from "../constant/depth";
import { Entity } from "../entities/Entity";
import AttackState from "../entities/states/attack/AttackState";
import CrouchAttackState from "../entities/states/attack/CrouchAttackState";
import FallAttackState from "../entities/states/attack/FallAttackState";
import JumpAttackState from "../entities/states/attack/JumpAttackState";
import JumpMomentumAttackState from "../entities/states/attack/JumpMomentumAttackState";
import SecondaryAttackState from "../entities/states/attack/SecondaryAttackState";
import CrouchState from "../entities/states/crouch/CrouchState";
import DeathState from "../entities/states/death/DeathState";
import HurtState from "../entities/states/hurt/HurtState";
import IdleState from "../entities/states/idle/IdleState";
import BackFlipState from "../entities/states/jump/BackFlipState";
import FallState from "../entities/states/jump/FallState";
import JumpMomentumState from "../entities/states/jump/JumpMomentumState";
import JumpState from "../entities/states/jump/JumpState";
import GoDownstairLeftState from "../entities/states/stair/GoDownstairLeftState";
import GoDownstairRightState from "../entities/states/stair/GoDownstairRightState";
import GoUpstairLeftState from "../entities/states/stair/GoUpstairLeftState";
import GoUpstairRightState from "../entities/states/stair/GoUpstairRightState";
import WalkLeftState from "../entities/states/walk/WalkLeftState";
import WalkRightState from "../entities/states/walk/WalkRightState";
import Boomerang from "../entities/weapons/Boomerang";
import ThrowingAxe from "../entities/weapons/ThrowingAxe";
import ThrowingBomb from "../entities/weapons/ThrowingBomb";
import ThrowingKnife from "../entities/weapons/ThrowingKnife";
import BaseRetrievableItem from "../gameobjects/BaseRetrievableItem";
import BigAmmoRetrievableItem from "../gameobjects/BigAmmoRetrievableItem";
import AmmoRetrievableItem from "../gameobjects/AmmoRetrievableItem";
import ScoreRetrievableItem from "../gameobjects/ScoreRetrievableItem";
import WeaponRetrievableItem from "../gameobjects/WeaponRetrievableItem";
import SaveLoadService from "../services/SaveLoadService";
import { TCharacterConfig, TStatus } from "../types/types";
import StateMachine from "../utils/StateMachine";
import StairAttackState from "../entities/states/attack/StairAttackState";
import StairSecondaryAttackState from "../entities/states/attack/StairSecondaryAttackState";
import { PALETTE_DB32 } from "../constant/colors";
import JumpSecondaryAttackState from "../entities/states/attack/JumpSecondaryAttackState";
import JumpMomentumSecondaryAttackState from "../entities/states/attack/JumpMomentumSecondaryAttackState";
import FallSecondaryAttackState from "../entities/states/attack/FallSecondaryAttackState";
import { Orb } from "../gameobjects/Orb";
import { Boss } from "../entities/enemies/Boss";

export default class Player extends Entity
{
    public multipleShots: number;
    constructor(config: TCharacterConfig)
    {
        super(config);

        this.scene = config.scene;

        this.secondaryWeaponGroup = this.scene.secondaryWeaponGroup;

        this.setName(PLAYER_A_NAME)
            .setDepth(DEPTH.PLAYER)
            .setPhysicsProperties({
                gravity: 800,
                speed: 65,
                acceleration: 600,
                stairSpeed: 160,
                dragCoeff: 10,
                isHurt: false,
                isDead: false,
                isAttacking: false,
                isPaused: false
            });

        this.setMultipleShots(1);

        const statusJson = SaveLoadService.loadGameData();

        if (statusJson)
        {
            const status: TStatus = JSON.parse(statusJson);

            this.setStatus(status);

            this.x = status.position.x;
            this.y = status.position.y;
        }
        else
        {
            this.setStatus({
                health: 16,
                life: 3,
                score: 0,
                stage: 1,
                ammo: 5,
                canTakeStairs: false,
                position: {
                    x: 2 * TILE_SIZE,
                    y: 69 * TILE_SIZE
                }
            });

            SaveLoadService.saveGameData(this.status.toJson());
        }

        this.frameList = {
            stairUp: 'richter-stair-up_',
            stairDown: 'richter-stair-down_',
            stairMiddle: 'richter-walk_1'
        }

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        {
            const currentAnim = this.anims.getName();

            const { JUMP_ATTACK, CROUCH_ATTACK, UPSTAIR_ATTACK, DOWNSTAIR_ATTACK, HURT, JUMP_SECONDARY_ATTACK } = this.animList;

            if ([JUMP_ATTACK, CROUCH_ATTACK, UPSTAIR_ATTACK, DOWNSTAIR_ATTACK, HURT].includes(currentAnim))
            {
                this.meleeWeapon?.body.setEnable(false);

                this.physicsProperties.isAttacking = false;
            }
        }, this);

        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, () =>
        {
            const currenFrame = this.anims.getFrameName();

            const attackFrames = [
                'richter-attack_2',
                'richter-crouch-attack_2',
                'richter-jump-attack_2',
                'richter-stair-up-attack_2',
                'richter-stair-down-attack_2'
            ];

            if (attackFrames.includes(currenFrame))
            {
                this.meleeWeapon?.body.setEnable(true);

                this.scene.playSound(10);
            }
        });

        this.on(Phaser.Animations.Events.ANIMATION_START, () =>
        {
            const currentAnim = this.anims.getName();

            if (currentAnim === this.animList.CROUCH || currentAnim === this.animList.CROUCH_ATTACK)
            {
                this.damageBody.changeBodySize(8, 20);
            }
            else if (this.damageBody.body.height === 20)
            {
                this.damageBody.changeBodySize(8, 28);
            }
        });

        if (!this.scene)
        {
            throw new Error("NO SCENE ON PLAYER");

        }

        this.scene?.events.on('enemy-score', (score: number) => this.status.setScore(this.status.score + score));

        this.animList = {
            IDLE: 'richter-idle',
            JUMP: 'richter-jump',
            JUMP_ATTACK: 'richter-jump-attack',
            JUMP_SECONDARY_ATTACK: 'richter-jump-secondary-attack',
            CROUCH: 'richter-crouch',
            CROUCH_ATTACK: 'richter-crouch-attack',
            LEFT: 'richter-walk',
            RIGHT: 'richter-walk',
            HURT: 'richter-hurt',
            FALL: 'richter-fall',
            BACK_FLIP: 'richter-back-flip',
            UPSTAIR: 'richter-stair-up',
            UPSTAIR_ATTACK: 'richter-stair-up-attack',
            UPSTAIR_SECONDARY_ATTACK: 'richter-stair-up-secondary-attack',
            DOWNSTAIR: 'richter-stair-down',
            DOWNSTAIR_ATTACK: 'richter-stair-down-attack',
            DOWNSTAIR_SECONDARY_ATTACK: 'richter-stair-down-secondary-attack',
            ATTACK: 'richter-attack',
            SECONDARY_ATTACK: 'richter-attack2',
            DEAD: 'richter-dead'
        };

        this.body.setMaxVelocity(this.physicsProperties.speed, this.physicsProperties.speed * 4)
            .setSize(16, 16)
            .setOffset(56, 32);

        this.damageBody.changeBodySize(8, 28);

        this.stateMachine = new StateMachine(EPossibleState.IDLE, {
            idle: new IdleState() as IdleState,
            attack: new AttackState() as AttackState,
            secondaryAttack: new SecondaryAttackState() as SecondaryAttackState,
            left: new WalkLeftState() as WalkLeftState,
            right: new WalkRightState() as WalkRightState,
            jump: new JumpState() as JumpState,
            jumpAttack: new JumpAttackState() as JumpAttackState,
            jumpSecondaryAttack: new JumpSecondaryAttackState() as JumpSecondaryAttackState,
            jumpMomentum: new JumpMomentumState() as JumpMomentumState,
            jumpMomentumAttack: new JumpMomentumAttackState() as JumpMomentumAttackState,
            jumpMomentumSecondaryAttack: new JumpMomentumSecondaryAttackState() as JumpMomentumSecondaryAttackState,
            fall: new FallState() as FallState,
            backFlip: new BackFlipState() as BackFlipState,
            fallAttack: new FallAttackState() as FallAttackState,
            fallSecondaryAttack: new FallSecondaryAttackState() as FallSecondaryAttackState,
            crouch: new CrouchState() as CrouchState,
            crouchAttack: new CrouchAttackState() as CrouchAttackState,
            hurt: new HurtState() as HurtState,
            upstairRight: new GoUpstairRightState() as GoUpstairRightState,
            upstairLeft: new GoUpstairLeftState() as GoUpstairLeftState,
            downstairRight: new GoDownstairRightState() as GoDownstairRightState,
            downstairLeft: new GoDownstairLeftState() as GoDownstairLeftState,
            stairAttack: new StairAttackState() as StairAttackState,
            stairSecondaryAttack: new StairSecondaryAttackState as StairSecondaryAttackState,
            death: new DeathState() as DeathState
        }, [this.scene, this]);

        this.canUseState = new Set(Object.keys(this.stateMachine.possibleStates));

        this.addMeleeWeapon({ width: 50, height: 8, name: 'whip' });
    }

    public preUpdate(time: number, delta: number)
    {
        super.preUpdate(time, delta);

        if (this.physicsProperties.isDead && this.anims.getName() !== this.animList.DEAD)
        {
            this.anims.stop();
            this.setFrame('richter-dead');
            console.log('anims after death anims', this.anims.getName());
        }

        if (!this.physicsProperties.isDead
            && !this.scene.isChangingStage
            && (this.body.top >= this.scene.cameras.main.getBounds().bottom + TILE_SIZE
                || this.body.bottom === this.scene.colliderLayer.height)
        )
        {
            this.die();
        }
    }

    public getItem(_item: Phaser.Types.Physics.Arcade.GameObjectWithBody)
    {
        switch (true)
        {
            case _item instanceof BigAmmoRetrievableItem:
                {
                    const bigHeart = _item as BigAmmoRetrievableItem;
                    bigHeart.body.setEnable(false);

                    const value = this.status.ammo + bigHeart.quantity;

                    this.scene.playSound(23);

                    this.status.setAmmo(value);

                    this.scene.itemsGroup.remove(bigHeart, true, true);

                    break;
                }

            case _item instanceof AmmoRetrievableItem:
                {
                    const littleHeart = _item as AmmoRetrievableItem;
                    littleHeart.body.setEnable(false);

                    this.scene.playSound(23);

                    const value = this.status.ammo + littleHeart.quantity;

                    this.status.setAmmo(value);

                    this.scene.itemsGroup.remove(littleHeart, true, true);

                    break;
                }

            case _item instanceof ScoreRetrievableItem:
                {
                    const moneyBag = _item as ScoreRetrievableItem;
                    moneyBag.body.setEnable(false);

                    this.scene.playSound(23);

                    const value = this.status.score + moneyBag.quantity;

                    this.status.setScore(value);

                    this.scene.itemsGroup.remove(moneyBag, true, true);

                    break;
                }

            case _item instanceof WeaponRetrievableItem:
                {
                    const weapon = _item as WeaponRetrievableItem;
                    weapon.body.setEnable(false);

                    this.addSecondaryWeapon(weapon.name);

                    this.scene.playSound(23);

                    this.scene.itemsGroup.remove(weapon, true, true);

                    break;
                }

            case _item instanceof BaseRetrievableItem:
                {
                    const item = _item as BaseRetrievableItem;
                    item.body.setEnable(false);

                    const { name } = item;

                    this.addItem(name);

                    this.scene.playSound(23);

                    this.scene.itemsGroup.remove(item, true, true);

                    break;
                }

            case _item instanceof Orb:
                {
                    this.scene.endStage();
                }
            default:
                break;
        }
    }

    private addItem(itemName: string)
    {
        switch (itemName)
        {
            case 'double-shot':
                {
                    if (this.scene.secondaryWeaponGroup.getLength() === 0) return;

                    this.setMultipleShots(2);

                    const secondaryWeaponName = this.scene.secondaryWeaponGroup.getChildren()[0].name;

                    this.addSecondaryWeapon(secondaryWeaponName);

                    break;
                }

            case 'triple-shot':
                {
                    if (this.scene.secondaryWeaponGroup.getLength() === 0) return;

                    this.setMultipleShots(3);

                    const secondaryWeaponName = this.scene.secondaryWeaponGroup.getChildren()[0].name;

                    this.addSecondaryWeapon(secondaryWeaponName);

                    break;
                }

            case 'pork':
                const { health } = this.status;

                const newHealth = Phaser.Math.Clamp(health + 6, 0, 16);

                this.status.setHealth(newHealth);

                break;

            case 'rosary':
                const cam = this.scene.cameras.main;
                const visibleEnemies = this.scene.enemies.filter(enemy => enemy.active && cam.worldView.contains(enemy.body.center.x, enemy.body.center.y));

                visibleEnemies.forEach(enemy => enemy.die());

                this.scene.playSound(37);

                this.scene.time.addEvent({
                    delay: 100,
                    repeat: 4,
                    callback: () =>
                    {
                        cam.flash(50);
                    }
                });

                break;

            default:
                break;
        }
    }

    private setMultipleShots(value: number)
    {
        this.multipleShots = value;

        this.scene.events.emit(HUD_EVENTS_NAMES.SHOTS, value);
    }

    public addSecondaryWeapon(weaponType: string)
    {
        let secondaryWeaponName: string | null = this.scene.secondaryWeaponGroup.getChildren()[0]?.name;

        if (secondaryWeaponName !== weaponType && this.multipleShots > 1)
        {
            this.setMultipleShots(1);
        }

        secondaryWeaponName = null;

        switch (weaponType)
        {
            case 'cross':
                this.addCross();

                break;

            case 'dagger':
                this.addDagger();

                break;

            case 'holyWater':
                this.addHolyWater();

                break;

            case 'axe':
                this.addAxe();

                break;

            default:
                this.clearSecondaryWeapons();

                this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON, 'no weapon');
                break;
        }
    }

    private clearSecondaryWeapons()
    {
        this.scene.secondaryWeaponGroup.clear(true, true);
    }

    private addCross()
    {
        this.clearSecondaryWeapons();

        for (let i = 0; i < this.multipleShots; i += 1)
        {
            const weapon = new Boomerang({
                scene: this.scene,
                parent: this,
                damage: 1.5,
                x: this.body.x,
                y: this.body.y,
                texture: 'items',
                frame: 'weapon-cross_1',
                anims: 'cross',
                sound: 8,
                group: 'weaponGroup'
            });

            weapon.setName('cross');

            this.secondaryWeaponGroup.add(weapon);
        }

        this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON, 'cross');
    }

    private addHolyWater()
    {
        this.clearSecondaryWeapons();

        for (let i = 0; i < this.multipleShots; i += 1)
        {
            const weapon = new ThrowingBomb({
                scene: this.scene,
                parent: this,
                damage: 1,
                x: this.body.x,
                y: this.body.y,
                texture: 'items',
                frame: 'weapon-holywater',
                anims: 'holy-water',
                sound: 31,
                group: 'weaponGroup'
            });

            weapon.setName('holyWater');

            this.secondaryWeaponGroup.add(weapon);
        }

        this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON, 'holy-water');
    }

    private addAxe()
    {
        this.clearSecondaryWeapons();

        for (let i = 0; i < this.multipleShots; i += 1)
        {
            const weapon = new ThrowingAxe({
                scene: this.scene,
                parent: this,
                damage: 1.5,
                x: this.body.x,
                y: this.body.y,
                texture: 'items',
                frame: 'weapon-axe',
                anims: 'axe',
                sound: 10,
                group: 'weaponGroup'
            });

            weapon.setName('axe');

            this.secondaryWeaponGroup.add(weapon);
        }

        this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON, 'axe');
    }

    private addDagger()
    {
        this.clearSecondaryWeapons();

        for (let i = 0; i < this.multipleShots; i += 1)
        {
            const weapon = new ThrowingKnife({
                scene: this.scene,
                parent: this,
                damage: 1,
                x: this.body.x,
                y: this.body.y,
                texture: 'items',
                frame: 'dagger',
                anims: 'dagger',
                sound: 9,
                group: 'weaponGroup'
            });

            weapon.setName('dagger');

            this.secondaryWeaponGroup.add(weapon);
        }

        this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON, 'dagger');
    }

    public setStatusHealthDamage(damage: number): Entity
    {
        if (this.physicsProperties.isHurt) return this;

        this.physicsProperties.isHurt = true;

        const health = this.status.health - damage;

        if (health > 0)
        {
            this.status.setHealth(health);

            this.scene.events.emit(HUD_EVENTS_NAMES.HEALTH, this.status.health);

            this.setTint(PALETTE_DB32.AFFAIR);

            this.scene.time.addEvent({
                delay: 200,
                repeat: 8,
                callback: () =>
                {
                    if (!this.isTinted)
                    {
                        this.setTint(PALETTE_DB32.AFFAIR);
                    }
                    else
                    {
                        this.clearTint()
                    }
                }
            })

            this.scene.time.addEvent({
                delay: 2000,
                callback: () =>
                {
                    if (!this.active) return;

                    this.physicsProperties.isHurt = false;
                }
            })

            return this;
        }

        this.status.setHealth(0);

        if (this.name === PLAYER_A_NAME)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.HEALTH, 0);
        }

        this.setStatusIsDead(true);

        this.die();

        return this;
    }

    public die(): void
    {
        this.physicsProperties.isDead = true;

        this.body.stop();

        this.anims.play(this.animList.DEAD!);

        this.status.setLife(this.status.life - 1);

        this.multipleShots = 1;

        this.clearSecondaryWeapons();

        this.scene.playSong(12, false);

        if (this.scene.isBossBattle)
        {
            Boss.endBossBattle(this.scene);
        }

        // GAME OVER
        if (this.status.life < 0)
        {
            this.gameOver();

            return;
        }

        this.status.setHealth(16).setAmmo(5);

        SaveLoadService.saveGameData(this.status.toJson());

        this.scene.events.emit('hud-life', this.status.life);

        this.scene.cameras.main.fade(1000);

        this.scene.time.addEvent({
            delay: 2000,
            callback: () =>
            {
                this.scene.scene.restart();
            }
        });
    }

    private gameOver()
    {
        const position = {
            x: 0,
            y: 0
        }

        switch (Number(this.status.stage.toString()[0]))
        {
            case 1:
                {
                    position.x = 2 * TILE_SIZE;
                    position.y = 69 * TILE_SIZE;
                    break;
                }
            case 2:
                {
                    position.x = 226 * TILE_SIZE;
                    position.y = 65 * TILE_SIZE;

                    break;
                }
            case 3:
                {
                    position.x = 110 * TILE_SIZE;
                    position.y = 30 * TILE_SIZE;

                    break;
                }
            case 4:
                {
                    position.x = 276 * TILE_SIZE;
                    position.y = 74 * TILE_SIZE;

                    break;
                }
            case 5:
                {
                    position.x = 527 * TILE_SIZE;
                    position.y = 67 * TILE_SIZE;

                    break;
                }
            case 6:
                {
                    position.x = 478 * TILE_SIZE;
                    position.y = 34 * TILE_SIZE;

                    break;
                }
            case 7:
                {
                    position.x = 334 * TILE_SIZE;
                    position.y = 19 * TILE_SIZE;

                    break;
                }
            default:
                break;
        }

        this.setStatus({
            health: 16,
            life: 3,
            score: 0,
            stage: this.status.stage,
            ammo: 5,
            canTakeStairs: false,
            position: position
        });

        SaveLoadService.saveGameData(this.status.toJson());

        this.scene.currentPlayingSong?.once(Phaser.Sound.Events.COMPLETE, () =>
        {
            this.scene.scene.start(SCENES_NAMES.GAMEOVER, { retry: false })
        });
    }
}