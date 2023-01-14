import { DEPTH } from "../../constant/depth";
import Player from "../../custom/entities/Player";
import GameScene from "../../scenes/GameScene";
import { TWeaponConfig } from "../../types/types";
import { Enemy } from "../../custom/entities/Enemy";
import { Entity } from "../Entity";
import Weapon from "./Weapon";

/**
 * A ranged weapon acting like a knife throw
 */
export default class ThrowingKnife extends Phaser.GameObjects.Sprite implements Weapon
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    public parent: Entity;
    public weaponGroup: Phaser.GameObjects.Group;
    public damage: number = 0;
    public canStun: boolean = false;
    public speed: number = 300;
    private weaponAnim?: string;
    private sfx: number;
    constructor(config: TWeaponConfig)
    {
        super(config.scene, config.x, config.y, config.texture, config.frame);

        this.parent = config.parent;

        this.weaponGroup = config.scene[config.group];

        this.damage = config.damage;

        this.sfx = config.sound;

        this.scene.add.existing(this);

        this.scene.physics.world.enable(this);

        this.setActive(false).setDepth(DEPTH.WEAPON);

        this.body.setAllowGravity(false).setEnable(false).setCircle(8);

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
        this.body.reset(this.parent.body.x, this.parent.body.y - 8);
        this.body.setEnable(true);

        if (this.parent instanceof Player)
        {
            this.scene.playersWeaponGroup.add(this);
        }
        else if (this.parent instanceof Enemy)
        {
            this.parent.secondaryWeaponGroup.add(this);
        }

        if (this.parent.flipX)
        {
            this.setFlipX(true);

            this.body.setVelocityX(-this.speed);
        }
        else
        {
            this.setFlipX(false);

            this.body.setVelocityX(this.speed);
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
        this.scene.customGame.destroyTileItem(this, _candle);
    }

    public destroyTile(_tile: Phaser.Tilemaps.Tile)
    {

    }
}