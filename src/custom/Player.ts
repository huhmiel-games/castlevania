import { EPossibleState } from "../constant/character";
import { HUD_EVENTS_NAMES, PLAYER_A_NAME, SCENES_NAMES, TILE_SIZE } from "../constant/config";
import { DEPTH } from "../constant/depth";
import { Entity } from "../entities/Entity";
import AttackState from "../entities/states/attack/AttackState";
import CrouchAttackState from "../entities/states/attack/CrouchAttackState";
import FallAttackState from "../entities/states/attack/FallAttackState";
import JumpAttackState from "../entities/states/attack/JumpAttackState";
import JumpMomentumAttackState from "../entities/states/attack/JumpMomentumAttackState";
import SecondaryAttackState from "../entities/states/attack/SecondaryAttack";
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
import { MeleeWeapon } from "../entities/weapons/MeleeWeapon";
import ThrowingAxe from "../entities/weapons/ThrowingAxe";
import ThrowingBomb from "../entities/weapons/ThrowingBomb";
import ThrowingKnife from "../entities/weapons/ThrowingKnife";
import BaseRetrievableItem from "../gameobjects/BaseRetrievableItem";
import BigAmmoRetrievableItem from "../gameobjects/BigAmmoRetrievableItem";
import AmmoRetrievableItem from "../gameobjects/AmmoRetrievableItem";
import ScoreRetrievableItem from "../gameobjects/ScoreRetrievableItem";
import WeaponRetrievableItem from "../gameobjects/WeaponRetrievableItem";
import SaveLoadService from "../services/SaveLoadService";
import { TCharacterConfig } from "../types/types";
import StateMachine from "../utils/StateMachine";
import StairAttackState from "../entities/states/attack/StairAttack";
import StairSecondaryAttackState from "../entities/states/attack/StairSecondaryAttack";
import { PALETTE_DB32 } from "../constant/colors";

export default class Player extends Entity
{
    public multipleShots: number;
    constructor(config: TCharacterConfig)
    {
        super(config);

        this.scene = config.scene;

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
            const status = JSON.parse(statusJson);

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

            SaveLoadService.saveGameData(this.status);
        }

        this.frameList = {
            stairUp: 'richter-stair-up_',
            stairDown: 'richter-stair-down_',
            stairMiddle: 'richter-walk_1'
        }

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        {
            const currentAnim = this.anims.getName();

            const { JUMP_ATTACK, CROUCH_ATTACK, UPSTAIR_ATTACK, DOWNSTAIR_ATTACK, HURT } = this.animList;

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

        if(!this.scene){
            throw new Error("NO SCENE ON PLAYER");
            
        }

        this.scene?.events.on('enemy-score', (score: number) => this.setStatusScore(this.status.score + score));

        

        this.animList = {
            IDLE: 'richter-idle',
            JUMP: 'richter-jump',
            JUMP_ATTACK: 'richter-jump-attack',
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
            jumpMomentum: new JumpMomentumState() as JumpMomentumState,
            jumpMomentumAttack: new JumpMomentumAttackState() as JumpMomentumAttackState,
            fall: new FallState() as FallState,
            backFlip: new BackFlipState() as BackFlipState,
            fallAttack: new FallAttackState() as FallAttackState,
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

        this.meleeWeapon = new MeleeWeapon({
            scene: this.scene,
            parent: this,
            x: this.body.x,
            y: this.body.y,
            texture: 'whitePixel',
            frame: ''
        });

        this.meleeWeapon.setAlpha(0).setSize(50, 8).setName('whip');
        this.meleeWeapon.body.setSize(50, 8);
    }

    public preUpdate(time: number, delta: number)
    {
        super.preUpdate(time, delta);

        if (!this.physicsProperties.isDead && (
            this.body.top > this.scene.cameras.main.getBounds().bottom + TILE_SIZE
            || this.body.bottom === this.scene.colliderLayer.height
            )
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

                    this.setStatusAmmo(value);

                    bigHeart.setActive(false).setVisible(false);

                    break;
                }

            case _item instanceof AmmoRetrievableItem:
                {
                    const littleHeart = _item as AmmoRetrievableItem;
                    littleHeart.body.setEnable(false);

                    this.scene.playSound(23);

                    const value = this.status.ammo + littleHeart.quantity;

                    this.setStatusAmmo(value);

                    littleHeart.setActive(false).setVisible(false);

                    break;
                }

            case _item instanceof ScoreRetrievableItem:
                {
                    const moneyBag = _item as ScoreRetrievableItem;
                    moneyBag.body.setEnable(false);

                    this.scene.playSound(23);

                    const value = this.status.score + moneyBag.quantity;

                    this.setStatusScore(value);

                    moneyBag.setActive(false).setVisible(false);

                    break;
                }

            case _item instanceof WeaponRetrievableItem:
                {
                    const weapon = _item as WeaponRetrievableItem;
                    weapon.body.setEnable(false);

                    this.addSecondaryWeapon(weapon.name);

                    this.scene.playSound(23);

                    weapon.setActive(false).setVisible(false);

                    break;
                }

            case _item instanceof BaseRetrievableItem:
                {
                    const item = _item as BaseRetrievableItem;
                    item.body.setEnable(false);

                    const { name } = item;

                    this.addItem(name);

                    this.scene.playSound(23);

                    item.setActive(false).setVisible(false);

                    break;
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

                this.setStatusHealth(newHealth);

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

        if (this.scene.secondaryWeaponGroup.getLength() > 0)
        {
            console.log(this.scene.secondaryWeaponGroup.getChildren());

            throw new Error("secondary weapon group not empty");

        }
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
                sound: 8
            });

            weapon.setName('cross');

            this.scene.secondaryWeaponGroup.add(weapon);
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
                sound: 31
            });

            weapon.setName('holyWater');

            this.scene.secondaryWeaponGroup.add(weapon);
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
                sound: 10
            });

            weapon.setName('axe');

            this.scene.secondaryWeaponGroup.add(weapon);
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
                sound: 9
            });

            weapon.setName('dagger');

            this.scene.secondaryWeaponGroup.add(weapon);
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
            this.setStatusHealth(health);

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

        this.setStatusHealth(0);

        if (this.name === PLAYER_A_NAME)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.HEALTH, 0);
        }

        this.setStatusIsDead(true);

        this.die();

        return this;
    }

    public setStatusScore(score: number): Entity
    {
        this.status.score = score;

        this.scene?.events.emit(HUD_EVENTS_NAMES.SCORE, this.status.score);

        return this;
    }

    public die(): void
    {
        this.physicsProperties.isDead = true;

        this.body.stop();

        this.anims.play(this.animList.DEAD!);

        this.status.life! -= 1;

        this.multipleShots = 1;

        this.clearSecondaryWeapons();

        this.scene.playSong(12, false);

        // GAME OVER
        if (this.status.life! < 0)
        {
            this.gameOver();

            return;
        }

        this.setStatusHealth(16).setStatusAmmo(5);

        SaveLoadService.saveGameData(this.status);

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

        SaveLoadService.saveGameData(this.status);

        this.scene.currentPlayingSong?.once(Phaser.Sound.Events.COMPLETE, () =>
        {
            this.scene.scene.start(SCENES_NAMES.GAMEOVER, { retry: false })
        });
    }
}