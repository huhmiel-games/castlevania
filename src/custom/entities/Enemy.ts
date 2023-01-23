import { IEnemyAI, TCharacterConfig, TEntityConfig } from "../../types/types";
import { ATLAS_NAMES, PLAYER_A_NAME, TILE_SIZE } from "../../constant/config";
import StateTimestamp from "../../utils/StateTimestamp";
import { PALETTE_DB32 } from "../../constant/colors";
import { DEPTH } from "../../constant/depth";
import { Entity } from "../../entities/Entity";
import { ENEMY_NAMES, EPossibleState } from "../../constant/character";
import StateMachine from "../../utils/StateMachine";
import AttackState from "../../entities/states/attack/AttackState";
import DeathState from "../../entities/states/death/DeathState";
import FallState from "../../entities/states/jump/FallState";
import WalkLeftState from "../../entities/states/walk/WalkLeftState";
import WalkRightState from "../../entities/states/walk/WalkRightState";
import IdleState from "../../entities/states/idle/IdleState";
import CrouchAttackState from "../../entities/states/attack/CrouchAttackState";
import FallAttackState from "../../entities/states/attack/FallAttackState";
import JumpAttackState from "../../entities/states/attack/JumpAttackState";
import JumpMomentumAttackState from "../../entities/states/attack/JumpMomentumAttackState";
import SecondaryAttackState from "../../entities/states/attack/SecondaryAttackState";
import StairAttackState from "../../entities/states/attack/StairAttackState";
import StairSecondaryAttackState from "../../entities/states/attack/StairSecondaryAttackState";
import CrouchState from "../../entities/states/crouch/CrouchState";
import HurtState from "../../entities/states/hurt/HurtState";
import BackFlipState from "../../entities/states/jump/BackFlipState";
import JumpMomentumState from "../../entities/states/jump/JumpMomentumState";
import JumpState from "../../entities/states/jump/JumpState";
import GoDownstairLeftState from "../../entities/states/stair/GoDownstairLeftState";
import GoDownstairRightState from "../../entities/states/stair/GoDownstairRightState";
import GoUpstairLeftState from "../../entities/states/stair/GoUpstairLeftState";
import GoUpstairRightState from "../../entities/states/stair/GoUpstairRightState";
import FlyLeftState from "../../entities/states/fly/FlyLeftState";
import FlyRightState from "../../entities/states/fly/FlyRightState";
import FireBall from "../../entities/weapons/FireBall";
import ThrowingAxe from "../../entities/weapons/ThrowingAxe";
import Boomerang from "../../entities/weapons/Boomerang";
import RecoilLeftState from "../../entities/states/walk/RecoilLeftState";
import RecoilRightState from "../../entities/states/walk/RecoilRightState";
import FlyIdleState from "../../entities/states/fly/FlyIdleState";
import MoveUpState from "../../entities/states/moves/MoveUpState";
import MoveDownState from "../../entities/states/moves/MoveDownState";
import StunState from "../../entities/states/hurt/StunState";
import JumpSecondaryAttackState from "../../entities/states/attack/JumpSecondaryAttackState";
import JumpMomentumSecondaryAttackState from "../../entities/states/attack/JumpMomentumSecondaryAttackState";
import FallSecondaryAttackState from "../../entities/states/attack/FallSecondaryAttackState";
import { Scythe } from "../../entities/weapons/Scythe";
import SaveLoadService from "../../services/SaveLoadService";
import { WEAPON_NAMES } from "../../constant/weapons";
import { error } from "../../utils/log";

export class Enemy extends Entity
{
    public stateTimestamp: StateTimestamp;
    public ai: IEnemyAI;

    constructor(config: TCharacterConfig, enemyJSON: TEntityConfig)
    {
        super(config)

        this.scene.physics.world.enable(this);

        this.scene.add.existing(this);

        this.config = enemyJSON;

        this.secondaryWeaponGroup = this.scene.add.group();

        this.animList = enemyJSON.config.animList;

        this.setPhysicsProperties(enemyJSON.physicsProperties)
            .setStatus(enemyJSON.status)
            .setDepth(DEPTH.ENEMY)

        this.body.setMaxVelocity(this.physicsProperties.speed, this.physicsProperties.speed * 4)
            .setSize(enemyJSON.physics.body.width, enemyJSON.physics.body.height)
            .setOffset(enemyJSON.physics.body.offsetX, enemyJSON.physics.body.offsetY);

        if (enemyJSON.physicsProperties.gravity === 0)
        {
            this.body.setAllowGravity(false);
        }

        if (enemyJSON.physics.damageBody.type === 'square')
        {
            this.damageBody.changeBodySize(enemyJSON.physics.damageBody.width, enemyJSON.physics.damageBody.height);
        }
        else
        {
            this.damageBody.body.setCircle(enemyJSON.physics.damageBody.width, -enemyJSON.physics.damageBody.width, -enemyJSON.physics.damageBody.width)
        }

        const possibleStates = this.generatePossibleStates(enemyJSON.state);

        const initialState = Object.keys(EPossibleState).find(key => EPossibleState[key] === Object.keys(possibleStates)[0]) as string;

        this.stateMachine = new StateMachine(EPossibleState[initialState], possibleStates, [this.scene, this]);

        this.canUseState = new Set(Object.keys(this.stateMachine.possibleStates));

        this.scene.enemies.push(this);

        this.scene.customGame.enemiesDamageBody.push(this.damageBody);
    }

    public preUpdate(time: number, delta: number)
    {
        super.preUpdate(time, delta);

        if (!this.active) return;

        this.ai?.execute();
    }

    public setAi(ai: IEnemyAI)
    {
        this.ai = ai;

        return this;
    }

    public setDamage(damage: number): Entity
    {
        if (!this.scene) this.destroy();

        if (this.physicsProperties.isHurt) return this;

        this.physicsProperties.isHurt = true;

        const health = this.status.health - damage;

        if (health <= 0)
        {
            this.status.setHealth(0);

            this.setDead(true);

            this.die();

            return this;
        }

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
        });

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

    public isOutsideCameraByPixels(offset: number = 128): boolean
    {
        const cam = this.scene.cameras.main;

        if (this.body.right > cam.worldView.right + offset || this.body.left < cam.worldView.left - offset)
        {
            return true;
        }

        return false;
    }

    public isInsideCameraByPixels(offset: number = 128): boolean
    {
        const cam = this.scene.cameras.main;

        return this.body.right < cam.worldView.right + offset && this.body.left > cam.worldView.left - offset
    }

    public die(): void
    {
        if (!this.active) return;

        this.setActive(false);

        this.body.stop().setEnable(false);

        this.damageBody.setActive(false);
        this.damageBody.body.setEnable(false);

        SaveLoadService.setEnemiesDeathCount();

        SaveLoadService.setSavedGameTime(this.scene);

        this.resetAllButtons();

        if (this.name === ENEMY_NAMES.EAGLE)
        {
            this.ai[ENEMY_NAMES.FLEAMAN]?.kill();
        }

        if (this.name === ENEMY_NAMES.BONE_DRAGON)
        {
            this.ai['childs']?.reverse().forEach((child, i) =>
            {
                this.scene.time.addEvent({
                    delay: 100 * i,
                    callback: () =>
                    {
                        child.die();
                    }
                })
            })
        }

        const deathFlame: Phaser.GameObjects.Sprite = this.scene.enemyDeathGroup.get(this.damageBody.body.center.x, this.damageBody.body.bottom, ATLAS_NAMES.ENEMIES, 'enemy-death-1', false);

        if (deathFlame)
        {
            this.setTintFill(PALETTE_DB32.BLACK);

            this.scene.events.emit('enemy-score', this.status.score);

            deathFlame.setOrigin(0.5, 1);
            deathFlame.y = this.damageBody.body.bottom + 8;
            deathFlame.setActive(true).setVisible(true);
            deathFlame.setDepth(this.depth - 1);

            deathFlame.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
            {
                deathFlame.setActive(false).setVisible(false);

                this.setVisible(false).clearTint();

                if (this.config.resurrect > 0)
                {
                    this.resurrects();
                }
                else
                {
                    this.kill();
                }
            });

            deathFlame.anims.play('enemy-death', true);
        }
        else
        {
            error("No death free in enemyDeathGroup");

        }
    }

    public killAndRespawn(): void
    {
        this.damageBody.body.setEnable(false);
        this.damageBody.setActive(false);

        this.setActive(false).setVisible(false);

        this.body.stop().setEnable(false);

        this.resurrects();
    }

    public kill(): void
    {
        this.scene?.children.remove(this.damageBody);

        this.scene?.children.remove(this);

        this.ai?.reset();
        this.damageBody.destroy();
        this.destroy();
    }

    private resurrects(forceNow: boolean = false)
    {
        this.scene?.time.addEvent({
            delay: forceNow === false ? Phaser.Math.RND.between(1000, this.config.resurrect) : 0,
            callback: () =>
            {
                if (!this.scene || this.scene.isBossBattle)
                {
                    this.destroy();

                    return;
                }

                if (!this.scene.cameras.main.worldView.contains(this.config.status.position.x, this.config.status.position.y) || forceNow === true)
                {
                    this.resetAllButtons();

                    this.stateMachine.transition(this.stateMachine.initialState, this.stateMachine.state);

                    if (!this.config.alignToPlayer)
                    {
                        this.body.reset(this.config.status.position.x, this.config.status.position.y);
                    }
                    else
                    {
                        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

                        this.body.reset(this.config.status.position.x, player.body.bottom - TILE_SIZE);
                    }

                    this.ai.reset();

                    this.body.setEnable(true);

                    this.scene?.time.addEvent({
                        delay: 32,
                        callback: () =>
                        {
                            if (!this.active)
                            {
                                this.damageBody.setActive(false);

                                return;
                            }
                            this.damageBody.setActive(true);
                            this.damageBody.body.setEnable(true);
                        }
                    })

                    this.setActive(true).setVisible(true);

                    this.physicsProperties.isHurt = false;
                    this.physicsProperties.isDead = false;
                }
                else
                {
                    this.resurrects();
                }
            }
        })

    }

    private generatePossibleStates(state: string[])
    {
        let possibleStates = {};

        state.forEach((state: string) =>
        {
            switch (state)
            {
                case EPossibleState.IDLE:
                    possibleStates[EPossibleState.IDLE] = new IdleState() as IdleState;
                    break;
                case EPossibleState.ATTACK:
                    possibleStates[EPossibleState.ATTACK] = new AttackState() as AttackState;
                    break;
                case EPossibleState.SECONDARY_ATTACK:
                    possibleStates[EPossibleState.SECONDARY_ATTACK] = new SecondaryAttackState() as SecondaryAttackState;
                    break;
                case EPossibleState.LEFT:
                    possibleStates[EPossibleState.LEFT] = new WalkLeftState() as WalkLeftState;
                    break;
                case EPossibleState.RIGHT:
                    possibleStates[EPossibleState.RIGHT] = new WalkRightState() as WalkRightState;
                    break;
                case EPossibleState.RECOIL_LEFT:
                    possibleStates[EPossibleState.RECOIL_LEFT] = new RecoilLeftState() as RecoilLeftState;
                    break;
                case EPossibleState.RECOIL_RIGHT:
                    possibleStates[EPossibleState.RECOIL_RIGHT] = new RecoilRightState() as RecoilRightState;
                    break;
                case EPossibleState.JUMP:
                    possibleStates[EPossibleState.JUMP] = new JumpState() as JumpState;
                    break;
                case EPossibleState.JUMP_ATTACK:
                    possibleStates[EPossibleState.JUMP_ATTACK] = new JumpAttackState() as JumpAttackState;
                    break;
                case EPossibleState.JUMP_MOMENTUM:
                    possibleStates[EPossibleState.JUMP_MOMENTUM] = new JumpMomentumState() as JumpMomentumState;
                    break;
                case EPossibleState.JUMP_MOMENTUM_ATTACK:
                    possibleStates[EPossibleState.JUMP_MOMENTUM_ATTACK] = new JumpMomentumAttackState() as JumpMomentumAttackState;
                    break;
                case EPossibleState.JUMP_SECONDARY_ATTACK:
                    possibleStates[EPossibleState.JUMP_SECONDARY_ATTACK] = new JumpSecondaryAttackState() as JumpSecondaryAttackState;
                    break;
                case EPossibleState.JUMP_MOMENTUM_SECONDARY_ATTACK:
                    possibleStates[EPossibleState.JUMP_MOMENTUM_SECONDARY_ATTACK] = new JumpMomentumSecondaryAttackState() as JumpMomentumSecondaryAttackState;
                    break;
                case EPossibleState.FALL_SECONDARY_ATTACK:
                    possibleStates[EPossibleState.FALL_SECONDARY_ATTACK] = new FallSecondaryAttackState() as FallSecondaryAttackState;
                    break;
                case EPossibleState.FALL:
                    possibleStates[EPossibleState.FALL] = new FallState() as FallState;
                    break;
                case EPossibleState.BACK_FLIP:
                    possibleStates[EPossibleState.BACK_FLIP] = new BackFlipState() as BackFlipState;
                    break;
                case EPossibleState.FALL_ATTACK:
                    possibleStates[EPossibleState.FALL_ATTACK] = new FallAttackState() as FallAttackState;
                    break;
                case EPossibleState.CROUCH:
                    possibleStates[EPossibleState.CROUCH] = new CrouchState() as CrouchState;
                    break;
                case EPossibleState.CROUCH_ATTACK:
                    possibleStates[EPossibleState.CROUCH_ATTACK] = new CrouchAttackState() as CrouchAttackState;
                    break;
                case EPossibleState.HURT:
                    possibleStates[EPossibleState.HURT] = new HurtState() as HurtState;
                    break;
                case EPossibleState.STUN:
                    possibleStates[EPossibleState.STUN] = new StunState() as StunState;
                    break;
                case EPossibleState.UPSTAIR_RIGHT:
                    possibleStates[EPossibleState.UPSTAIR_RIGHT] = new GoUpstairRightState() as GoUpstairRightState;
                    break;
                case EPossibleState.UPSTAIR_LEFT:
                    possibleStates[EPossibleState.UPSTAIR_LEFT] = new GoUpstairLeftState() as GoUpstairLeftState;
                    break;
                case EPossibleState.DOWNSTAIR_RIGHT:
                    possibleStates[EPossibleState.DOWNSTAIR_RIGHT] = new GoDownstairRightState() as GoDownstairRightState;
                    break;
                case EPossibleState.DOWNSTAIR_LEFT:
                    possibleStates[EPossibleState.DOWNSTAIR_LEFT] = new GoDownstairLeftState() as GoDownstairLeftState;
                    break;
                case EPossibleState.STAIR_ATTACK:
                    possibleStates[EPossibleState.STAIR_ATTACK] = new StairAttackState() as StairAttackState;
                    break;
                case EPossibleState.STAIR_SECONDARY_ATTACK:
                    possibleStates[EPossibleState.STAIR_SECONDARY_ATTACK] = new StairSecondaryAttackState as StairSecondaryAttackState;
                    break;
                case EPossibleState.DEATH:
                    possibleStates[EPossibleState.DEATH] = new DeathState() as DeathState;
                    break;
                case EPossibleState.FLY_LEFT:
                    possibleStates[EPossibleState.FLY_LEFT] = new FlyLeftState() as FlyLeftState;
                    break;
                case EPossibleState.FLY_RIGHT:
                    possibleStates[EPossibleState.FLY_RIGHT] = new FlyRightState() as FlyRightState;
                    break;
                case EPossibleState.FLY_IDLE:
                    possibleStates[EPossibleState.FLY_IDLE] = new FlyIdleState() as FlyIdleState;
                    break;
                case EPossibleState.UP:
                    possibleStates[EPossibleState.UP] = new MoveUpState() as MoveUpState;
                    break;
                case EPossibleState.DOWN:
                    possibleStates[EPossibleState.DOWN] = new MoveDownState() as MoveDownState;
                    break;
                default:
                    break;
            }
        });

        return possibleStates;
    }

    public resetAllButtons()
    {
        if (!this || !this.scene) return;

        const { now } = this.scene.time;

        for (let key in this.buttons)
        {
            this.buttons[key].setUp(now);
        }
    }

    public addSecondaryWeapon(weaponType: WEAPON_NAMES)
    {
        switch (weaponType)
        {
            case WEAPON_NAMES.FIREBALL:
                const fireball = new FireBall({
                    scene: this.scene,
                    parent: this,
                    damage: 1.5,
                    x: this.body.x,
                    y: this.body.y,
                    texture: ATLAS_NAMES.ENEMIES,
                    frame: 'fireBall_0',
                    anims: 'fireBall',
                    sound: 10,
                    group: 'enemyWeaponGroup'
                });

                fireball.setName(WEAPON_NAMES.FIREBALL);

                this.scene.enemyWeaponGroup.add(fireball);
                this.secondaryWeaponGroup.add(fireball);

                break;

            case WEAPON_NAMES.BONE:
                const bone = new ThrowingAxe({
                    scene: this.scene,
                    parent: this,
                    damage: 1,
                    x: this.body.x,
                    y: this.body.y,
                    texture: ATLAS_NAMES.ENEMIES,
                    frame: 'skeleton-bone_0',
                    anims: 'skeleton-bone',
                    sound: 10,
                    group: 'enemyWeaponGroup'
                });

                bone.setName(WEAPON_NAMES.BONE);

                this.scene.enemyWeaponGroup.add(bone);
                this.secondaryWeaponGroup.add(bone);

                break;

            case WEAPON_NAMES.AXE:
                const axe = new Boomerang({
                    scene: this.scene,
                    parent: this,
                    damage: 1.5,
                    x: this.body.x,
                    y: this.body.y,
                    texture: ATLAS_NAMES.ITEMS,
                    frame: 'weapon-axe_3',
                    anims: 'axe',
                    sound: 10,
                    group: 'enemyWeaponGroup'
                }, 15, 1500);

                axe.setName(WEAPON_NAMES.AXE);

                this.scene.enemyWeaponGroup.add(axe);
                this.secondaryWeaponGroup.add(axe);

                break;

            case WEAPON_NAMES.SCYTHE:
                const scythe = new Scythe({
                    scene: this.scene,
                    parent: this,
                    damage: 1.5,
                    x: this.body.x,
                    y: this.body.y,
                    texture: ATLAS_NAMES.ENEMIES,
                    frame: 'scythe_0',
                    anims: 'scythe',
                    sound: 10,
                    group: 'enemyWeaponGroup'
                });

                scythe.setName(WEAPON_NAMES.SCYTHE);

                this.scene.enemyWeaponGroup.add(scythe);
                this.secondaryWeaponGroup.add(scythe);

                break;

            default:
                break;
        }
    }
}
