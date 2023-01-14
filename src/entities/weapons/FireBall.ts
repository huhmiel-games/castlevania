import { DEPTH } from "../../constant/depth";
import destroyCandle from "../../custom/destroyCandle";
import Player from "../../custom/Player";
import GameScene from "../../scenes/GameScene";
import { TWeaponConfig } from "../../types/types";
import { Enemy } from "../../custom/enemies/Enemy";
import { Entity } from "../Entity";
import Weapon from "./Weapon";

/**
 * A ranged weapon acting like a knife throw
 */
export default class FireBall extends Phaser.GameObjects.Sprite implements Weapon
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    public parent: Entity;
    public damage: number = 0;
    public speed: number = 100;
    private weaponAnim?: string;
    private sfx: number;
    constructor(config: TWeaponConfig)
    {
        super(config.scene, config.x, config.y, config.texture, config.frame);

        this.parent = config.parent;

        this.damage = config.damage;

        this.sfx = config.sound;

        this.scene.add.existing(this);

        this.scene.physics.world.enable(this);

        this.setActive(false).setDepth(DEPTH.WEAPON);

        this.body.setAllowGravity(false).setEnable(false).setCircle(4);

        this.weaponAnim = config.anims;

        this.setDisable();
    }

    public preUpdate(time: number, delta: number)
    {
        super.preUpdate(time, delta);

        if (!this.scene.isInsideCameraByPixels(this.body, 16))
        {
            this.setDisable();
        }
    }

    public setDisable()
    {
        this.body.setEnable(false);

        this.setActive(false).setVisible(false);
    }

    public attack()
    {
        const offsetY = this.parent.config.secondaryAttackOffsetY;
        this.body.reset(this.parent.body.x, this.parent.body.y + (offsetY || -8));
        this.body.setEnable(true);

        const target: Entity | null = this.parent.config.withTarget ? this.scene.getPlayerByName(this.parent.config.withTarget) : null;

        if (this.parent instanceof Player)
        {
            this.scene.weaponGroup.add(this);
        }
        else if (this.parent instanceof Enemy)
        {
            this.parent.secondaryWeaponGroup.add(this);
        }

        // straight fire
        if (this.parent.flipX && !target)
        {
            this.setFlipX(true);

            this.body.setVelocityX(-this.speed);
        }
        else if(!this.parent.flipX && !target)
        {
            this.setFlipX(false);

            this.body.setVelocityX(this.speed);
        }

        // fire on target
        if (this.parent.flipX && target)
        {
            this.setFlipX(true);

            this.scene.physics.accelerateToObject(this, target, this.speed * 2);
        }
        else if(!this.parent.flipX && target)
        {
            this.setFlipX(false);

            this.scene.physics.accelerateToObject(this, target, this.speed * 2);
        }

        // adjust fire angle
        if(target)
        {
            if(target.damageBody.body.center.x > this.parent.body.center.x)
            {
                const angle = Phaser.Math.Angle.BetweenPoints(this.parent.damageBody, target.damageBody);

                this.setAngle(Phaser.Math.RadToDeg(angle));
            }

            if(target.damageBody.body.center.x < this.parent.body.center.x)
            {
                const angle = Phaser.Math.Angle.BetweenPoints(target.damageBody, this.parent.damageBody);

                this.setAngle(Phaser.Math.RadToDeg(angle));
            }
        }

        if (this.weaponAnim)
        {
            this.anims.play(this.weaponAnim);
        }

        this.scene.playSound(this.sfx);

        this.setActive(true).setVisible(true);
    }


    public destroyObject(_candle: unknown)
    {
        destroyCandle(this.scene, this, _candle);
    }

    public destroyTile(_tile: Phaser.Tilemaps.Tile)
    {

    }
}