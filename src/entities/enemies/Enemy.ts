import { TCharacterConfig } from "../../types/types";
import StateTimestamp from "../../utils/StateTimestamp";
import { Entity } from "../Entity";
import { EPossibleState } from "../../constant/character";
import StateMachine from "../../utils/StateMachine";
import AttackState from "../states/attack/AttackState";
import DeathState from "../states/death/DeathState";
import FallState from "../states/jump/FallState";
import WalkLeftState from "../states/walk/WalkLeftState";
import WalkRightState from "../states/walk/WalkRightState";
import IdleState from "../states/idle/IdleState";
import { DEPTH } from "../../constant/depth";
import CrouchAttackState from "../states/attack/CrouchAttackState";
import FallAttackState from "../states/attack/FallAttackState";
import JumpAttackState from "../states/attack/JumpAttackState";
import JumpMomentumAttackState from "../states/attack/JumpMomentumAttackState";
import SecondaryAttackState from "../states/attack/SecondaryAttack";
import StairAttackState from "../states/attack/StairAttack";
import StairSecondaryAttackState from "../states/attack/StairSecondaryAttack";
import CrouchState from "../states/crouch/CrouchState";
import HurtState from "../states/hurt/HurtState";
import BackFlipState from "../states/jump/BackFlipState";
import JumpMomentumState from "../states/jump/JumpMomentumState";
import JumpState from "../states/jump/JumpState";
import GoDownstairLeftState from "../states/stair/GoDownstairLeftState";
import GoDownstairRightState from "../states/stair/GoDownstairRightState";
import GoUpstairLeftState from "../states/stair/GoUpstairLeftState";
import GoUpstairRightState from "../states/stair/GoUpstairRightState";
import { PALETTE_DB32 } from "../../constant/colors";
import ProximityState from "../states/enemy/ProximityState";
import SideState from "../states/enemy/SideState";
import { IEnemyIA as IEnemyAI } from "../../interfaces/interface";
import FlyLeftState from "../states/enemy/FlyLeftState";
import FlyRightState from "../states/enemy/FlyRightState";

export class Enemy extends Entity
{
    public stateTimestamp: StateTimestamp;
    public ai: IEnemyAI;
    public config: any;

    constructor(config: TCharacterConfig, enemyJSON)
    {
        super(config)

        this.scene.physics.world.enable(this);

        this.scene.add.existing(this);

        this.config = enemyJSON;

        this.animList = enemyJSON.config.animList;

        this.setPhysicsProperties(enemyJSON.physicsProperties)
            .setStatus(enemyJSON.status)
            .setDepth(DEPTH.GROUND_LAYER + 1)

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
    }

    public preUpdate(time: number, delta: number)
    {
        super.preUpdate(time, delta);

        if (!this.active) return;

        this.ai.decides();
    }

    public setAi(ai: IEnemyAI)
    {
        this.ai = ai;

        return this;
    }

    public setStatusHealthDamage(damage: number): Entity
    {
        if (this.physicsProperties.isHurt) return this;

        this.physicsProperties.isHurt = true;

        const health = this.status.health - damage;

        if (health > 0)
        {
            this.setStatusHealth(health);

            this.setTint(PALETTE_DB32.ROMAN)

            this.scene.time.addEvent({
                delay: 100,
                repeat: 4,
                callback: () => {
                    if(!this.isTinted)
                    {
                        this.setTint(PALETTE_DB32.WELL_READ)
                    }
                    else
                    {
                        this.clearTint()
                    }
                    
                }
            })

            this.scene.time.addEvent({
                delay: 500,
                callback: () =>
                {
                    if (!this.active) return;

                    this.physicsProperties.isHurt = false;
                }
            })

            return this;
        }

        this.setStatusHealth(0);

        this.setStatusIsDead(true);

        this.die();

        return this;
    }

    public isOutsideScreenByPixels(pixels: number = 128): boolean
    {
        const cam = this.scene.cameras.main;

        if(this.body.right > cam.worldView.right + pixels || this.body.left < cam.worldView.left - pixels)
        {
            return true;
        }

        return false;
    }

    public die(): void
    {
        if (!this.active) return;

        this.setActive(false);

        this.body.stop().setEnable(false);

        this.damageBody.setActive(false);
        this.damageBody.body.setEnable(false);

        this.resetAllButtons();

        const deathFlame: Phaser.GameObjects.Sprite = this.scene.enemyDeathGroup.get(this.damageBody.body.center.x, this.damageBody.body.bottom, 'enemies', 'enemy-death-1', false);

        if (deathFlame)
        {
            this.setTintFill(PALETTE_DB32.BLACK);

            deathFlame.setOrigin(0.5, 1);
            deathFlame.y = this.damageBody.body.bottom + 8;
            deathFlame.setActive(true).setVisible(true);
            deathFlame.setDepth(this.depth - 1);

            deathFlame.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
            {
                deathFlame.setActive(false).setVisible(false);

                this.setVisible(false).clearTint();

                if (this.config.resurrect)
                {
                    this.resurrects();
                }
            });

            deathFlame.anims.play('enemy-death', true);
        }
        else
        {
            throw new Error("No death free in enemyDeathGroup");

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
        this.damageBody.body.setEnable(false);
        this.damageBody.setActive(false);

        this.setActive(false).setVisible(false);

        this.body.stop().setEnable(false);
    }

    private resurrects()
    {
        this.scene?.time.addEvent({
            delay: Phaser.Math.RND.between(1000, 10000),
            callback: () =>
            {
                if (!this.scene)
                {
                    this.destroy();

                    return;
                }

                if (!this.scene.cameras.main.worldView.contains(this.config.status.position.x, this.config.status.position.y))
                {
                    this.resetAllButtons();

                    this.stateMachine.transition(this.stateMachine.initialState, this.stateMachine.state);

                    this.setPosition(this.config.status.position.x, this.config.status.position.y);

                    this.body.setEnable(true);

                    this.damageBody.setActive(true);
                    this.damageBody.body.setEnable(true);

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
                case EPossibleState.PROXIMITY:
                    possibleStates[EPossibleState.PROXIMITY] = new ProximityState() as ProximityState;
                    break;
                case EPossibleState.FLY_LEFT:
                    possibleStates[EPossibleState.FLY_LEFT] = new FlyLeftState() as FlyLeftState;
                    break;
                case EPossibleState.FLY_RIGHT:
                    possibleStates[EPossibleState.FLY_RIGHT] = new FlyRightState() as FlyRightState;
                    break;
                case EPossibleState.SIDE:
                    possibleStates[EPossibleState.SIDE] = new SideState() as SideState;
                    break;
                default:
                    break;
            }
        });

        return possibleStates;
    }

    public resetAllButtons()
    {
        const { now } = this.scene.time;

        for (let key in this.buttons)
        {
            this.buttons[key].setUp(now);
        }
    }
}