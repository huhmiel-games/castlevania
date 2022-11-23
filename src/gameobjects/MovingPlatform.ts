import { MOVING_PLATFORM_SPEED } from "../constant/config";
import { DEPTH } from "../constant/depth";
import GameScene from "../scenes/GameScene";

export default class MovingPlatform extends Phaser.GameObjects.Image
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    constructor(config: { scene: GameScene; x: number; y: number; texture: string | Phaser.Textures.Texture; frame: string | number; })
    {
        super(config.scene, config.x, config.y, config.texture, config.frame);

        this.scene.add.existing(this);

        this.setName('movingPlatform').setOrigin(0, 0).setDepth(DEPTH.GROUND_LAYER);

        this.scene.physics.world.enable(this);

        this.body.setAllowGravity(false)
            .setImmovable(true)
            .setFriction(1, 0)
            .setVelocityX(MOVING_PLATFORM_SPEED);
    }

    public preUpdate(time: number, delta: number)
    {
        if (this.body.blocked.left)
        {
            this.body.setVelocityX(MOVING_PLATFORM_SPEED);
        }

        if (this.body.blocked.right)
        {
            this.body.setVelocityX(-MOVING_PLATFORM_SPEED);
        }
    }
}