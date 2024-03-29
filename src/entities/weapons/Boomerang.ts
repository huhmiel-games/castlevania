import { DEPTH } from "../../constant/depth";
import Player from "../../custom/entities/Player";
import GameScene from "../../scenes/GameScene";
import { TWeaponConfig } from "../../types/types";
import { Enemy } from "../../custom/entities/Enemy";
import { Entity } from "../Entity";
import Weapon from "./Weapon";

/**
 * A ranged weapon acting like a boomerang
 */
export default class Boomerang extends Phaser.GameObjects.Sprite implements Weapon
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    public parent: Entity;
    public damage: number = 0;
    public canStun: boolean = false;
    public speed: number = 100;
    public isBack: boolean = false;
    private weaponAnim: string | undefined;
    private sfx: number;
    public returnTimeDelay: number = 1000;
    private isBackDistance: number;
    constructor(config: TWeaponConfig, isBackDistance: number = 13, returnTimeDelay: number = 1000)
    {
        super(config.scene, config.x, config.y, config.texture, config.frame);

        this.parent = config.parent;

        this.damage = config.damage;

        this.isBackDistance = isBackDistance;

        this.returnTimeDelay = returnTimeDelay;

        this.sfx = config.sound;

        this.scene.add.existing(this);

        this.scene.physics.world.enable(this);

        this.setActive(false).setDepth(DEPTH.WEAPON);

        this.body.setAllowGravity(false).setEnable(false).setCircle(8);

        this.weaponAnim = config.anims;

        this.setDisable();

        this.on(Phaser.Animations.Events.ANIMATION_REPEAT, () =>
        {
            this.scene.playSound(this.sfx);
        });
    }

    public preUpdate(time: number, delta: number)
    {
        super.preUpdate(time, delta);

        if (!this.scene.cameras.main.worldView.contains(this.body.center.x, this.body.center.y))
        {
            const isOutsideCamera = this.isOutsideScreenByPixels();

            if (isOutsideCamera)
            {
                this.setDisable();
            }
        }

        if (this.isBack && this.scene.physics.overlap(this, this.parent.damageBody))
        {
            const { damageBody } = this.parent;

            const distance = Phaser.Math.Distance.BetweenPoints(this.body.center, damageBody.body.center);

            if (distance < this.isBackDistance)
            {
                this.setDisable();
            }
        }
    }

    private isOutsideScreenByPixels(pixels: number = 64): boolean
    {
        const cam = this.scene.cameras.main;

        if (this.body.right > cam.worldView.right + pixels || this.body.left < cam.worldView.left - pixels)
        {
            return true;
        }

        return false;
    }

    public setDisable()
    {
        this.body.setEnable(false);

        this.setActive(false).setVisible(false);
    }

    public attack(offset: number = 8)
    {
        if (!this || !this.body) return;

        this.isBack = false;

        this.body.reset(this.parent.body.x, this.parent.body.y - offset);
        this.body.setEnable(true);

        if (this.parent instanceof Player)
        {
            this.scene.playersWeaponGroup.add(this);
        }
        else if (this.parent instanceof Enemy)
        {
            this.parent.secondaryWeaponGroup.add(this);
        }

        this.speed = this.parent.flipX ? Math.abs(this.speed) * -1 : Math.abs(this.speed);

        this.body.setVelocityX(this.speed);

        if (this.weaponAnim) this.anims.play(this.weaponAnim);

        this.scene.playSound(this.sfx);

        this.scene.time.addEvent({
            delay: this.returnTimeDelay,
            callback: () =>
            {
                if (!this.active) return;

                this.isBack = true;

                if (this.weaponAnim) this.anims.playReverse(this.weaponAnim);

                this.body.setVelocityX(-this.speed);
            }
        });

        this.setActive(true).setVisible(true);
    }


    public destroyObject(_candle: unknown)
    {
        this.scene.customGame.destroyTileItem(this, _candle);
    }

    public destroyTile(_tile: Phaser.Tilemaps.Tile)
    {

    }
}