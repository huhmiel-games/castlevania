import { DEPTH } from "../../constant/depth";
import destroyCandle from "../../custom/destroyCandle";
import GameScene from "../../scenes/GameScene";
import { TWeaponConfig } from "../../types/types";
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

        if (!this.scene.cameras.main.worldView.contains(this.body.center.x, this.body.center.y))
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

        this.scene.enemyWeaponGroup.add(this);

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
        destroyCandle(this.scene, this, _candle);
    }

    public destroyTile(_tile: Phaser.Tilemaps.Tile)
    {

    }
}