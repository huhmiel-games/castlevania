import { DEPTH } from "../constant/depth";
import GameScene from "../scenes/GameScene";
import { Entity } from "./Entity";

export default class DamageBody extends Phaser.GameObjects.Image
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    public parent: Entity;
    public damage: number = 0; // for enemies making damage with their body
    constructor(config: { scene: GameScene; parent: Entity, x: number; y: number, width: number, height: number })
    {
        super(config.scene, config.x, config.y, 'whitePixel', 0);

        this.parent = config.parent;

        this.scene.add.existing(this);

        this.scene.physics.world.enable(this);

        this.setActive(true).setVisible(true).setDepth(DEPTH.WEAPON).setAlpha(0).setOrigin(0.5, 1);

        this.body.setAllowGravity(false).setEnable(true).setSize(config.width, config.height);

        this.onPostUpdateEvent();
    }

    private onPostUpdateEvent()
    {
        this.scene.events.on(Phaser.Scenes.Events.POST_UPDATE, this.followParent, this);
    }

    private followParent()
    {
        const { body } = this.parent;

        if (!body) return;

        this.setPosition(body.center.x, body.bottom - this.body.height / 2);
    }

    public changeBodySize(width: number, height: number)
    {
        this.body.setSize(width, height);
    }
}