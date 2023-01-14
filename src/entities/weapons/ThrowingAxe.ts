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
export default class ThrowingAxe extends Phaser.GameObjects.Sprite implements Weapon
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    public parent: Entity;
    public damage: number = 0;
    public canStun: boolean = false;
    public speed: number = 100;
    private weaponAnim?: string;
    private timestamp: number = 0;
    private sfx: number;
    constructor(config: TWeaponConfig)
    {
        super(config.scene, config.x, config.y, config.texture, config.frame);

        this.parent = config.parent;

        this.damage = config.damage;

        this.sfx = config.sound;

        this.scene.add.existing(this);

        this.scene.physics.world.enable(this);

        this.setActive(false).setDepth(DEPTH.WEAPON).setFrame(config.frame);

        this.body.setAllowGravity(true).setEnable(false).setCircle(8);

        this.weaponAnim = config.anims;

        this.setDisable();

        this.on(Phaser.Animations.Events.ANIMATION_REPEAT, () => {
            this.scene.playSound(this.sfx);
        });
    }

    public preUpdate(time: number, delta: number)
    {
        super.preUpdate(time, delta);

        const { top } = this.body;

        if(top > this.scene.cameras.main.getBounds().bottom + 16)
        {
            this.setDisable();
        }

        if (this.timestamp + 1500 < time)
        {
            this.body.setVelocityY(this.speed);
        }

    }

    public setDisable()
    {
        this.body.setEnable(false);

        this.setActive(false).setVisible(false);
    }

    public attack()
    {
        this.anims.play(this.weaponAnim!);

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

        this.body.setVelocityY(-this.speed * 4);

        this.setActive(true).setVisible(true);

        this.scene.playSound(this.sfx);

        this.timestamp = this.scene.time.now;
    }


    public destroyObject(_candle: unknown)
    {
        this.scene.customGame.destroyTileItem(this, _candle);
    }

    public destroyTile(_tile: Phaser.Tilemaps.Tile)
    {

    }
}