import { DEPTH } from "../../constant/depth";
import Player from "../../custom/Player";
import GameScene from "../../scenes/GameScene";
import { TWeaponConfig } from "../../types/types";
import { Enemy } from "../enemies/Enemy";
import { Entity } from "../Entity";
import Weapon from "./Weapon";

export class Scythe extends Phaser.GameObjects.Sprite implements Weapon
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

        this.body.setAllowGravity(false).setEnable(false).setCircle(8).setMaxVelocity(55);

        this.weaponAnim = config.anims;

        this.setDisable();

        this.on(Phaser.Animations.Events.ANIMATION_REPEAT, () => {
            this.scene.playSound(this.sfx);
        });
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
        const randomX = Phaser.Math.RND.between(480 * 16, 496 * 16);
        const randomY = Phaser.Math.RND.between(26 * 16, 34 * 16);

        this.body.reset(randomX, randomY);

        if (this.weaponAnim)
        {
            this.anims.play(this.weaponAnim, true);
        }

        this.scene.playSound(this.sfx);

        this.setActive(true).setVisible(true);

        if (this.parent instanceof Player)
        {
            this.scene.weaponGroup.add(this);
        }
        else if (this.parent instanceof Enemy)
        {
            this.parent.secondaryWeaponGroup.add(this);
        }

        this.aim();
    }

    private aim()
    {
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.body.setEnable(true);

                const target: Entity | null = this.parent.config.withTarget ? this.scene.getPlayerByName(this.parent.config.withTarget) : null;

                if(target)
                {
                    this.scene.physics.accelerateToObject(this, target);
                }
            }
        });
    }


    public destroyObject(_candle: unknown)
    {
    }

    public destroyTile(_tile: Phaser.Tilemaps.Tile)
    {

    }
}