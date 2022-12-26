import { EPossibleState, possibleDirection } from "../constant/character";
import { HUD_EVENTS_NAMES, PLAYER_A_NAME } from "../constant/config";
import GameScene from "../scenes/GameScene";
import
{
    RangedWeapon,
    TButtons,
    TCharacterConfig,
    TCoord,
    TEntityConfig,
    TStatus,
    TPhysicsProperties,
    TAnimationList,
    TFrameList
} from "../types/types";
import StateMachine from "../utils/StateMachine";
import StateTimestamp from "../utils/StateTimestamp";
import { MeleeWeapon } from "./weapons/MeleeWeapon";
import DamageBody from "./DamageBody";
import { Enemy } from "./enemies/Enemy";

/**
 * @description A base class for player and enemies
 * @author © Philippe Pereira 2022
 * @export
 * @class Entity
 * @extends {Phaser.GameObjects.Sprite}
 */
export class Entity extends Phaser.GameObjects.Sprite
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    public damageBody: DamageBody;
    public buttons: TButtons;
    public stateTimestamp = new StateTimestamp();
    public meleeWeapon: MeleeWeapon | undefined;
    public rangedWeapon: RangedWeapon | undefined;
    public canUseState: Set<string>;
    public status: TStatus;
    public physicsProperties: TPhysicsProperties;
    public animList: TAnimationList;
    public frameList?: TFrameList;
    public stateMachine: StateMachine;
    public secondaryWeaponGroup: Phaser.GameObjects.Group;
    public config: TEntityConfig;

    constructor(config: TCharacterConfig)
    {
        super(config.scene, config.x, config.y, config.texture, config.frame);

        if (config.buttons)
        {
            this.buttons = config.buttons;
        }

        this.scene.add.existing(this);

        this.scene.physics.world.enable(this);

        this.body.setCollideWorldBounds(true, 0, 0, true)
            .setBounce(0, 0)
            .setAllowGravity(true)
            .setFriction(0, 0);

        this.damageBody = new DamageBody({ scene: this.scene, parent: this, x: 0, y: 0, width: 8, height: 32 });
    }

    public preUpdate(time: number, delta: number)
    {
        super.preUpdate(time, delta);

        if (this.physicsProperties.isDead || this.physicsProperties.isPaused || !this.active) return;

        this.stateMachine.step();
    }

    /**
     * Check if a character can use a State
     * @param stateName 
     * @returns 
     */
    public canUse(stateName: EPossibleState): boolean
    {
        return this.canUseState.has(stateName);
    }

    public setStatus(status: TStatus): Entity
    {
        this.status = status;

        return this;
    }

    public setPhysicsProperties(physicsProperties: TPhysicsProperties): Entity
    {
        this.physicsProperties = physicsProperties;

        return this;
    }

    public setStatusScore(score: number): Entity
    {
        this.status.score = score;

        if (this.name === PLAYER_A_NAME)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.SCORE, this.status.score);
        }

        return this;
    }

    public setStatusHealth(health: number): Entity
    {
        this.status.health = health;

        if (this.name === PLAYER_A_NAME)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.HEALTH, this.status.health);
        }

        return this;
    }

    public setStatusAmmo(value: number): Entity
    {
        this.status.ammo = value;

        if (this.name === PLAYER_A_NAME)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.HEART, this.status.ammo);
        }

        return this;
    }

    public setStatusHealthDamage(damage: number): Entity
    {
        const health = this.status.health - damage;

        if (health > 0)
        {
            this.setStatusHealth(health);

            if (this.name === PLAYER_A_NAME)
            {
                this.scene.events.emit(HUD_EVENTS_NAMES.HEALTH, this.status.health);
            }

            return this;
        }

        this.setStatusHealth(0);

        this.setStatusIsDead(true);

        this.die();

        return this;
    }

    public setStatusSpeed(speed: number): Entity
    {
        this.physicsProperties.speed = speed;

        return this;
    }

    public setStatusAcceleration(acceleration: number): Entity
    {
        this.physicsProperties.acceleration = acceleration;

        return this;
    }

    public setStatusPosition(position: TCoord): Entity
    {
        this.status.position = position;

        return this;
    }

    public setStatusIsDead(isDead: boolean): Entity
    {
        this.physicsProperties.isDead = isDead;

        return this;
    }

    public getDirection()
    {
        const { left, right, up, down } = this.buttons;

        const directionIndex = 3 * ((up.isDown ? 1 : 0) - (down.isDown ? 1 : 0)) + (right.isDown ? 1 : 0) - (left.isDown ? 1 : 0);

        return possibleDirection[directionIndex + 4];
    }

    public die(): void
    {
        this.setActive(false).setVisible(false);
        this.body.setEnable(false);

        this.damageBody.setActive(false);
        this.damageBody.body.setEnable(false);
    }

    public getItem(item: Phaser.Types.Physics.Arcade.GameObjectWithBody)
    {

    }

    public primaryAttack(): void
    {
        
    }

    public secondaryAttack(): void
    {
        const ammo = this.status.ammo;

        if(ammo === 0) return;

        const weapon = this.secondaryWeaponGroup.getFirstDead(false, this.body.x, this.body.y, undefined, undefined, true) as RangedWeapon;

        if (!weapon)
        {
            return;
        }

        weapon.parent = this;

        this.physicsProperties.isAttacking = true;

        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        {
            if (this.physicsProperties.isDead) return;

            weapon.setDepth(this.depth - 1);

            weapon.attack(this.config?.secondaryAttackOffsetY || 8);

            const value = ammo - 1;

            this.setStatusAmmo(value);

            this.physicsProperties.isAttacking = false;
        });
    }
}