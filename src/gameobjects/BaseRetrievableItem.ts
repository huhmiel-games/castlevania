import { DEPTH } from "../constant/depth";
import GameScene from "../scenes/GameScene";
import { BaseItemConfig } from "../types/types";

export default class BaseRetrievableItem extends Phaser.GameObjects.Image
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    public quantity: number;
    constructor(config: BaseItemConfig)
    {
        super(config.scene, config.x, config.y, config.texture, config.frame);

        this.scene.add.existing(this);

        this.setName(config.name || 'baseItem')
            .setOrigin(0, 0)
            .setDepth(DEPTH.GROUND_LAYER)
            .setQuantity(config.quantity);

        this.scene.physics.world.enable(this);

        this.body.setAllowGravity(true).setImmovable(true);
    }

    preUpdate(time: number, delta: number): void
    {
        if (this.body.blocked.down && this.body.allowGravity)
        {
            this.body.setAllowGravity(false);
        }
    }

    setQuantity(quantity: number)
    {
        this.quantity = quantity;

        return this;
    }
}