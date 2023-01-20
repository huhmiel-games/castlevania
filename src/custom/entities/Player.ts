import { EPossibleState } from "../../constant/character";
import { ATLAS_NAMES, HUD_EVENTS_NAMES, PLAYER_A_NAME, SCENES_NAMES, STAGE_COUNTDOWN, TILE_SIZE } from "../../constant/config";
import { DEPTH } from "../../constant/depth";
import { Entity } from "../../entities/Entity";
import AttackState from "../../entities/states/attack/AttackState";
import CrouchAttackState from "../../entities/states/attack/CrouchAttackState";
import FallAttackState from "../../entities/states/attack/FallAttackState";
import JumpAttackState from "../../entities/states/attack/JumpAttackState";
import JumpMomentumAttackState from "../../entities/states/attack/JumpMomentumAttackState";
import SecondaryAttackState from "../../entities/states/attack/SecondaryAttackState";
import CrouchState from "../../entities/states/crouch/CrouchState";
import DeathState from "../../entities/states/death/DeathState";
import HurtState from "../../entities/states/hurt/HurtState";
import IdleState from "../../entities/states/idle/IdleState";
import BackFlipState from "../../entities/states/jump/BackFlipState";
import FallState from "../../entities/states/jump/FallState";
import JumpMomentumState from "../../entities/states/jump/JumpMomentumState";
import JumpState from "../../entities/states/jump/JumpState";
import GoDownstairLeftState from "../../entities/states/stair/GoDownstairLeftState";
import GoDownstairRightState from "../../entities/states/stair/GoDownstairRightState";
import GoUpstairLeftState from "../../entities/states/stair/GoUpstairLeftState";
import GoUpstairRightState from "../../entities/states/stair/GoUpstairRightState";
import WalkLeftState from "../../entities/states/walk/WalkLeftState";
import WalkRightState from "../../entities/states/walk/WalkRightState";
import Boomerang from "../../entities/weapons/Boomerang";
import ThrowingAxe from "../../entities/weapons/ThrowingAxe";
import ThrowingBomb from "../../entities/weapons/ThrowingBomb";
import ThrowingKnife from "../../entities/weapons/ThrowingKnife";
import BaseRetrievableItem from "../../gameobjects/BaseRetrievableItem";
import BigAmmoRetrievableItem from "../../gameobjects/BigAmmoRetrievableItem";
import AmmoRetrievableItem from "../../gameobjects/AmmoRetrievableItem";
import ScoreRetrievableItem from "../../gameobjects/ScoreRetrievableItem";
import WeaponRetrievableItem from "../../gameobjects/WeaponRetrievableItem";
import SaveLoadService from "../../services/SaveLoadService";
import { TCharacterConfig, TStatus } from "../../types/types";
import StateMachine from "../../utils/StateMachine";
import StairAttackState from "../../entities/states/attack/StairAttackState";
import StairSecondaryAttackState from "../../entities/states/attack/StairSecondaryAttackState";
import { PALETTE_DB32 } from "../../constant/colors";
import JumpSecondaryAttackState from "../../entities/states/attack/JumpSecondaryAttackState";
import JumpMomentumSecondaryAttackState from "../../entities/states/attack/JumpMomentumSecondaryAttackState";
import FallSecondaryAttackState from "../../entities/states/attack/FallSecondaryAttackState";
import { Orb } from "../../gameobjects/Orb";
import { Boss } from "./Boss";
import { TILE_ITEMS } from "../../constant/tiles";
import { WEAPON_NAMES } from "../../constant/weapons";

export default class Player extends Entity
{
    public multipleShots: number;
    constructor(config: TCharacterConfig)
    {
        super(config);

        this.scene = config.scene;

        this.secondaryWeaponGroup = this.scene.playersSecondaryWeaponGroup;

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
            if (this.meleeWeapon?.body.enable)
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

        const { start } = this.buttons;

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

        if (start.isDown && start.getDuration(time) < 16)
        {
            this.scene.setPause();
        }
    }

    public getItem(_item: Phaser.Types.Physics.Arcade.GameObjectWithBody)
    {
        SaveLoadService.setSavedGameTime(this.scene);

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

                    this.addSecondaryWeapon(weapon.name as WEAPON_NAMES);

                    this.scene.playSound(23);

                    this.scene.itemsGroup.remove(weapon, true, true);

                    break;
                }

            case _item instanceof BaseRetrievableItem:
                {
                    const item = _item as BaseRetrievableItem;
                    item.body.setEnable(false);

                    const { name } = item;

                    this.addItem(name as TILE_ITEMS);

                    this.scene.playSound(23);

                    this.scene.itemsGroup.remove(item, true, true);

                    break;
                }

            case _item instanceof Orb:
                {
                    if (this.status.stage === 73)
                    {
                        this.scene.endGame();

                        return;
                    }
                    this.scene.endStage();
                }
            default:
                break;
        }
    }

    private addItem(itemName: TILE_ITEMS)
    {
        switch (itemName)
        {
            case TILE_ITEMS.DOUBLE_SHOT:
                {
                    if (this.scene.playersSecondaryWeaponGroup.getLength() === 0) return;

                    this.setMultipleShots(2);

                    const secondaryWeaponName = this.scene.playersSecondaryWeaponGroup.getChildren()[0].name;

                    this.addSecondaryWeapon(secondaryWeaponName as WEAPON_NAMES);

                    break;
                }

            case TILE_ITEMS.TRIPLE_SHOT:
                {
                    if (this.scene.playersSecondaryWeaponGroup.getLength() === 0) return;

                    this.setMultipleShots(3);

                    const secondaryWeaponName = this.scene.playersSecondaryWeaponGroup.getChildren()[0].name;

                    this.addSecondaryWeapon(secondaryWeaponName as WEAPON_NAMES);

                    break;
                }

            case TILE_ITEMS.PORK:
                const { health } = this.status;

                const newHealth = Phaser.Math.Clamp(health + 6, 0, 16);

                this.status.setHealth(newHealth);

                break;

            case TILE_ITEMS.ROSARY:
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

    public addSecondaryWeapon(weaponType: WEAPON_NAMES)
    {
        let secondaryWeaponName: string | null = this.scene.playersSecondaryWeaponGroup.getChildren()[0]?.name;

        if (secondaryWeaponName !== weaponType && this.multipleShots > 1)
        {
            this.setMultipleShots(1);
        }

        secondaryWeaponName = null;

        switch (weaponType)
        {
            case WEAPON_NAMES.CROSS:
                this.addCross();

                break;

            case WEAPON_NAMES.DAGGER:
                this.addDagger();

                break;

            case WEAPON_NAMES.HOLY_WATER:
                this.addHolyWater();

                break;

            case WEAPON_NAMES.AXE:
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
        this.scene.playersSecondaryWeaponGroup.clear(true, true);
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
                texture: ATLAS_NAMES.ITEMS,
                frame: 'weapon-cross_1',
                anims: 'cross',
                sound: 8,
                group: 'weaponGroup'
            });

            weapon.setName(WEAPON_NAMES.CROSS);

            this.secondaryWeaponGroup.add(weapon);
        }

        this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON, WEAPON_NAMES.CROSS);
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
                texture: ATLAS_NAMES.ITEMS,
                frame: 'weapon-holywater',
                anims: 'holy-water',
                sound: 31,
                group: 'weaponGroup'
            });

            weapon.setName(WEAPON_NAMES.HOLY_WATER);

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
                texture: ATLAS_NAMES.ITEMS,
                frame: 'weapon-axe',
                anims: 'axe',
                sound: 10,
                group: 'weaponGroup'
            });

            weapon.setName(WEAPON_NAMES.AXE);

            this.secondaryWeaponGroup.add(weapon);
        }

        this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON, WEAPON_NAMES.AXE);
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
                texture: ATLAS_NAMES.ITEMS,
                frame: 'dagger',
                anims: 'dagger',
                sound: 9,
                group: 'weaponGroup'
            });

            weapon.setName(WEAPON_NAMES.DAGGER);

            this.secondaryWeaponGroup.add(weapon);
        }

        this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON, WEAPON_NAMES.DAGGER);
    }

    public setDamage(damage: number): Entity
    {
        if (this.physicsProperties.isHurt) return this;

        this.physicsProperties.isHurt = true;

        const health = this.status.health - (damage === 16 ? 16 : Phaser.Math.Clamp(damage, 0, 4));

        if (health > 0)
        {
            this.status.setHealth(health);

            SaveLoadService.setSavedGameTime(this.scene);

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

        this.setDead(true);

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

        this.scene.stageCountdown.stop();

        SaveLoadService.setPlayerDeathCount();

        SaveLoadService.setSavedGameTime(this.scene);

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

        const currentSavedScore = JSON.parse(SaveLoadService.loadGameData() as string).score
        this.status.setHealth(16).setAmmo(5).setScore(currentSavedScore);

        SaveLoadService.saveGameData(this.status.toJson());

        this.scene.events.emit(HUD_EVENTS_NAMES.LIFE, this.status.life);

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

        const currentSavedScore = JSON.parse(SaveLoadService.loadGameData() as string).score
        this.setStatus({
            health: 16,
            life: 3,
            score: currentSavedScore,
            stage: this.status.stage,
            ammo: 5,
            canTakeStairs: false,
            position: position
        });

        SaveLoadService.saveGameData(this.status.toJson());

        const stage = this.status.stage.toString().substring(0, 1) + 1;

        this.scene.stageCountdown.reset(false, STAGE_COUNTDOWN[stage]);

        this.scene.currentPlayingSong?.once(Phaser.Sound.Events.COMPLETE, () =>
        {
            this.scene.scene.start(SCENES_NAMES.GAMEOVER, { retry: false })
        });
    }
}