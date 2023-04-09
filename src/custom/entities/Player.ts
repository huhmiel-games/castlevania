import { EStates } from "../../constant/character";
import { ATLAS_NAMES, HUD_EVENTS_NAMES, PLAYERS_NAMES, SCENES_NAMES, STAGE_COUNTDOWN, TILE_SIZE } from "../../constant/config";
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
import { TCharacterConfig, TCoord, TStatus } from "../../types/types";
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
import sendDeathStat from "../../utils/sendStat";

export default class Player extends Entity
{
    public multipleShots: number;
    private attackFrames: string[];
    private player: 'A' | 'B' = 'A';
    constructor(config: TCharacterConfig)
    {
        super(config);

        this.scene = config.scene;

        this.secondaryWeaponGroup = this.scene.add.group();
        this.secondaryWeaponGroup.maxSize = 3;

        if (this.scene.characters.length === 0)
        {
            this.setName(PLAYERS_NAMES.A);
        }
        else
        {
            this.setName(PLAYERS_NAMES.B);

            this.player = 'B';
        }

        this.setDepth(DEPTH.PLAYER)
            .setPhysicsProperties({
                gravity: 800,
                speed: 65,
                acceleration: 600,
                stairSpeed: 160,
                dragCoeff: 10,
                isHurt: false,
                isDead: false,
                isAttacking: false,
                isPaused: false,
                isGameOver: false
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

        this.frameStairList = {
            stairUp: `${this.name}-stair-up_`,
            stairDown: `${this.name}-stair-down_`,
            stairMiddleLeft: `${this.name}-stair-middle-left`,
            stairMiddleRight: `${this.name}-stair-middle-right`,
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

            if (this.attackFrames.includes(currenFrame))
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

        this.setAnimList();

        this.attackFrames = [
            `${this.name}-attack_2`,
            `${this.name}-crouch-attack_2`,
            `${this.name}-jump-attack_2`,
            `${this.name}-stair-up-attack_2`,
            `${this.name}-stair-down-attack_2`
        ];

        this.body.setMaxVelocity(this.physicsProperties.speed, this.physicsProperties.speed * 4)
            .setSize(16, 16)
            .setOffset(56, 32);

        this.damageBody.changeBodySize(8, 28);

        this.stateMachine = new StateMachine(EStates.IDLE, {
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
            this.setFrame(`${this.name}-dead`);
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

    public setAnimList()
    {
        this.animList = {
            IDLE: `${this.name}-idle`,
            JUMP: `${this.name}-jump`,
            JUMP_ATTACK: `${this.name}-jump-attack`,
            JUMP_SECONDARY_ATTACK: `${this.name}-jump-secondary-attack`,
            CROUCH: `${this.name}-crouch`,
            CROUCH_ATTACK: `${this.name}-crouch-attack`,
            LEFT: `${this.name}-walk`,
            RIGHT: `${this.name}-walk`,
            HURT: `${this.name}-hurt`,
            FALL: `${this.name}-fall`,
            BACK_FLIP: `${this.name}-back-flip`,
            UPSTAIR: `${this.name}-stair-up`,
            UPSTAIR_ATTACK: `${this.name}-stair-up-attack`,
            UPSTAIR_SECONDARY_ATTACK: `${this.name}-stair-up-secondary-attack`,
            DOWNSTAIR: `${this.name}-stair-down`,
            DOWNSTAIR_ATTACK: `${this.name}-stair-down-attack`,
            DOWNSTAIR_SECONDARY_ATTACK: `${this.name}-stair-down-secondary-attack`,
            ATTACK: `${this.name}-attack`,
            SECONDARY_ATTACK: `${this.name}-attack2`,
            DEAD: `${this.name}-dead`
        };
    }

    public setAttackFrames(...frames: string[])
    {
        this.attackFrames = frames;
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
                    this.dropSecondaryWeapon();

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

    private dropSecondaryWeapon()
    {
        if (this.secondaryWeaponGroup.getLength() === 0) return;

        const secondaryWeaponName = this.secondaryWeaponGroup.getChildren()[0].name;

        const weapon = new WeaponRetrievableItem({ scene: this.scene, x: this.x, y: this.y, texture: ATLAS_NAMES.ITEMS, frame: secondaryWeaponName, quantity: 1, name: secondaryWeaponName })

        if (this.flipX)
        {
            weapon.body.setVelocity(150, -150);
        }
        else
        {
            weapon.body.setVelocity(-150, -150);
        }

        this.scene.time.addEvent({
            delay: 250,
            callback: () =>
            {
                weapon.body.setVelocity(0, 0);

                this.scene.itemsGroup.add(weapon);

                this.scene.customGame.setItemTimer(weapon);
            }
        });
    }

    private addItem(itemName: TILE_ITEMS)
    {
        switch (itemName)
        {
            case TILE_ITEMS.DOUBLE_SHOT:
                {
                    if (this.secondaryWeaponGroup.getLength() === 0) return;

                    this.setMultipleShots(2);

                    const secondaryWeaponName = this.secondaryWeaponGroup.getChildren()[0].name;

                    this.addSecondaryWeapon(secondaryWeaponName as WEAPON_NAMES);

                    break;
                }

            case TILE_ITEMS.TRIPLE_SHOT:
                {
                    if (this.secondaryWeaponGroup.getLength() === 0) return;

                    this.setMultipleShots(3);

                    const secondaryWeaponName = this.secondaryWeaponGroup.getChildren()[0].name;

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
                        cam.flash(50, 203, 219, 252);
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

        if (this.player === 'A')
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.SHOTS_PLAYER_A, value);
        }
        else
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.SHOTS_PLAYER_B, value);
        }
    }

    public addSecondaryWeapon(weaponType: WEAPON_NAMES)
    {
        let secondaryWeaponName: string | null = this.secondaryWeaponGroup.getChildren()[0]?.name;

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

                if (this.player === 'A')
                {
                    this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON_PLAYER_A, 'no weapon');
                }
                else
                {
                    this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON_PLAYER_B, 'no weapon');
                }

                break;
        }
    }

    private clearSecondaryWeapons()
    {
        this.secondaryWeaponGroup.clear(true, true);
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

        if (this.player === 'A')
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON_PLAYER_A, WEAPON_NAMES.CROSS);
        }
        else
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON_PLAYER_B, WEAPON_NAMES.CROSS);
        }
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

        if (this.player === 'A')
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON_PLAYER_A, 'holy-water');
        }
        else
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON_PLAYER_B, 'holy-water');
        }
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
                frame: 'weapon-axe_3',
                anims: 'axe',
                sound: 10,
                group: 'weaponGroup'
            });

            weapon.setName(WEAPON_NAMES.AXE);

            this.secondaryWeaponGroup.add(weapon);
        }

        if (this.player === 'A')
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON_PLAYER_A, WEAPON_NAMES.AXE);
        }
        else
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON_PLAYER_B, WEAPON_NAMES.AXE);
        }
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
                anims: undefined,
                sound: 9,
                group: 'weaponGroup'
            });

            weapon.setName(WEAPON_NAMES.DAGGER);

            this.secondaryWeaponGroup.add(weapon);
        }

        if (this.player === 'A')
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON_PLAYER_A, WEAPON_NAMES.DAGGER);
        }
        else
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON_PLAYER_B, WEAPON_NAMES.DAGGER);
        }
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

            if (this.player === 'A')
            {
                this.scene.events.emit(HUD_EVENTS_NAMES.HEALTH_PLAYER_A, this.status.health);
            }
            else
            {
                this.scene.events.emit(HUD_EVENTS_NAMES.HEALTH_PLAYER_B, this.status.health);
            }

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

        if (this.name === PLAYERS_NAMES.A)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.HEALTH_PLAYER_A, 0);
        }

        if (this.name === PLAYERS_NAMES.B)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.HEALTH_PLAYER_B, 0);
        }

        this.die();

        return this;
    }

    public die(): void
    {
        this.setDead(true);

        this.body.stop();

        this.anims.play(this.animList.DEAD!);

        this.status.setLife(this.status.life - 1);

        this.multipleShots = 1;

        SaveLoadService.setPlayerDeathCount();

        SaveLoadService.setSavedGameTime(this.scene);

        this.clearSecondaryWeapons();

        const { x, y } = this.damageBody.body.center;

        sendDeathStat(x, y);

        if (this.scene.isCoop)
        {
            this.coopDie();

            return;
        }

        this.scene.playSong(12, false);

        this.scene.stageCountdown.stop();

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

        const currentSavedScore = JSON.parse(SaveLoadService.loadGameData() as string).score;

        this.status.setHealth(16).setAmmo(5).setScore(currentSavedScore);

        SaveLoadService.saveGameData(this.status.toJson());

        if (this.player === 'A')
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.LIFE_PLAYER_A, this.status.life);
        }
        else
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.LIFE_PLAYER_B, this.status.life);
        }

        this.scene.cameras.main.fade(1000);

        this.scene.time.addEvent({
            delay: 2000,
            callback: () =>
            {
                this.scene.scene.restart({ isCoop: false });
            }
        });
    }

    private coopDie()
    {
        const totalLife = this.scene.characters.map(elm => elm.status.life).reduce((a, b) => a + b, 0);

        if (this.scene.isBossBattle && totalLife === -2)
        {
            Boss.endBossBattle(this.scene);
        }

        // GAME OVER
        if (totalLife === -2)
        {
            this.scene.stageCountdown.stop();

            this.gameOver();

            return;
        }

        if (this.status.life < 0)
        {
            this.anims.stop();
            this.physicsProperties.isGameOver = true;
            this.damageBody.destroy();
            this.body.setEnable(false);
            this.meleeWeapon?.body.setEnable(false)
            this.setActive(false).setVisible(false);

            return;
        };

        const currentSavedScore = JSON.parse(SaveLoadService.loadGameData() as string).score;

        this.status.setHealth(16).setAmmo(5).setScore(currentSavedScore);

        SaveLoadService.saveGameData(this.status.toJson());

        if (this.player === 'A')
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.LIFE_PLAYER_A, this.status.life);
            this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON_PLAYER_A, 'no weapon');
        }
        else
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.LIFE_PLAYER_B, this.status.life);
            this.scene.events.emit(HUD_EVENTS_NAMES.WEAPON_PLAYER_B, 'no weapon');
        }

        this.scene.time.addEvent({
            delay: 2000,
            callback: () =>
            {
                this.reintroducePlayer();
            }
        });
    }

    private gameOver()
    {
        if (this.scene.isCoop)
        {
            this.coopGameOver();

            return;
        }

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

    private coopGameOver()
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

        this.scene.characters.forEach(character => character.setStatus({
            health: 16,
            life: 3,
            score: currentSavedScore,
            stage: this.status.stage,
            ammo: 5,
            canTakeStairs: false,
            position: position
        }));

        SaveLoadService.saveGameData(this.status.toJson());

        const stage = this.status.stage.toString().substring(0, 1) + 1;

        this.scene.stageCountdown.reset(false, STAGE_COUNTDOWN[stage]);

        this.scene.playSong(12, false);

        this.scene.currentPlayingSong?.once(Phaser.Sound.Events.COMPLETE, () =>
        {
            this.scene.scene.start(SCENES_NAMES.GAMEOVER)
        });
    }

    private reintroducePlayer()
    {
        const { characters } = this.scene;

        const cam = this.scene.cameras.main;

        if (this === characters[0] && !characters[1].physicsProperties.isDead && characters[1].body.blocked.down)
        {
            this.body.reset(characters[1].body.center.x, characters[1].body.center.y - 16);
        }
        else if (this === characters[0] && characters[1].physicsProperties.isDead)
        {
            this.searchBlockTile();
        }

        if (this === characters[1] && !characters[0].physicsProperties.isDead && characters[0].body.blocked.down)
        {
            this.body.reset(characters[0].body.center.x, characters[0].body.center.y - 16);
        }
        else if (this === characters[1] && characters[0].physicsProperties.isDead)
        {
            this.searchBlockTile();
        }

        this.physicsProperties.isDead = false;
        this.physicsProperties.isHurt = false;
        this.physicsProperties.isAttacking = false;
    }

    private searchBlockTile()
    {
        const cam = this.scene.cameras.main;

        const { colliderLayer } = this.scene;

        const { centerX, left, right, bottom } = cam.worldView;

        if (this.body.center.x < centerX)
        {
            for (let i = 8; i < 256; i += TILE_SIZE)
            {
                for (let j = 8; j < 208; j += TILE_SIZE)
                {
                    const tile = colliderLayer.getTileAtWorldXY(left + i, bottom - j, true)

                    if (tile.index >= 0 && (tile.properties.leftTopRightBlock || tile.properties.topBlock || tile.properties.collides))
                    {
                        this.body.reset(left + i + 8, bottom - j - 48);
                        return;
                    }
                }
            }
        }

        if (this.body.center.x >= centerX)
        {
            for (let i = 8; i < 256; i += TILE_SIZE)
            {
                for (let j = 8; j < 208; j += TILE_SIZE)
                {
                    const tile = colliderLayer.getTileAtWorldXY(right - i, bottom - j, true)

                    if (tile.index >= 0 && (tile.properties.leftTopRightBlock || tile.properties.topBlock || tile.properties.collides))
                    {
                        this.body.reset(right - i - 16, bottom - j - 48);
                        return;
                    }
                }
            }
        }

        throw new Error("No collide tile found");
    }
}