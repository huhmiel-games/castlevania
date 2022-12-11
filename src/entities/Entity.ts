import { EPossibleState, possibleDirection } from "../constant/character";
import { HUD_EVENTS_NAMES, PLAYER_A_NAME } from "../constant/config";
import { IAnimationList, IFrameList, IPhysicsProperties, IStatus } from "../interfaces/interface";
import GameScene from "../scenes/GameScene";
import SaveLoadService from "../services/SaveLoadService";
import { RangedWeapon, TButtons, TCharacterConfig, TCoord, TAi } from "../types/types";
import StateMachine from "../utils/StateMachine";
import StateTimestamp from "../utils/StateTimestamp";
import { MeleeWeapon } from "./weapons/MeleeWeapon";
import DamageBody from "./DamageBody";
import ThrowingAxe from "./weapons/ThrowingAxe";
import FireBall from "./weapons/FireBall";

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
    public status: IStatus;
    public physicsProperties: IPhysicsProperties;
    public animList: IAnimationList;
    public frameList?: IFrameList;
    public stateMachine: StateMachine;
    public config: any;

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

        if (this.body.touching.down)
        {
            this.body.setDrag(0);
        }

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

    public setStatus(status: IStatus): Entity
    {
        this.status = status;

        return this;
    }

    public setPhysicsProperties(physicsProperties: IPhysicsProperties): Entity
    {
        this.physicsProperties = physicsProperties;

        return this;
    }

    public setStatusScore(score: number): Entity
    {
        this.status.score = score;

        this.scene.events.emit(HUD_EVENTS_NAMES.SCORE, this.status.score);

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

        this.scene.events.emit(HUD_EVENTS_NAMES.HEART, this.status.ammo);

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

    public addSecondaryWeapon(weaponType: string)
    {
        switch (weaponType)
        {
            case 'fireball':
                const fireball = new FireBall({
                    scene: this.scene,
                    parent: this,
                    damage: 1.5,
                    x: this.body.x,
                    y: this.body.y,
                    texture: 'items',
                    frame: 'fireBall_0',
                    anims: 'fireBall',
                    sound: 10
                });

                fireball.setName('fireball');

                this.scene.enemyWeaponGroup.add(fireball);

                break;

            case 'axe':
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

                this.scene.enemyWeaponGroup.add(weapon);

                break;

            default:
                break;
        }
    }
}