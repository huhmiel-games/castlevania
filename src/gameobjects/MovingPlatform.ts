import { MOVING_PLATFORM_SPEED } from "../constant/config";
import { DEPTH } from "../constant/depth";
import GameScene from "../scenes/GameScene";

export default class MovingPlatform extends Phaser.GameObjects.Image
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    private currentAcceleration: number = MOVING_PLATFORM_SPEED;
    constructor(config: { scene: GameScene; x: number; y: number; texture: string | Phaser.Textures.Texture; frame: string | number; })
    {
        super(config.scene, config.x, config.y, config.texture, config.frame);

        this.scene.add.existing(this);

        this.setName('movingPlatform').setOrigin(0, 0).setDepth(DEPTH.GROUND_LAYER);

        this.scene.physics.world.enable(this);

        this.body.setAllowGravity(false)
            .setImmovable(true)
            .setFriction(1, 0)
            .setMaxVelocityX(MOVING_PLATFORM_SPEED);

            const rightTile = this.scene.colliderLayer.getTileAtWorldXY(this.body.right, this.body.center.y);

            if(rightTile && rightTile.canCollide)
            {
                this.currentAcceleration = -MOVING_PLATFORM_SPEED;
            }
    }

    public preUpdate(time: number, delta: number)
    {
        const { body } = this;

        const { acceleration, blocked, bottom } = body;

        if (blocked.left)
        {
            this.currentAcceleration = MOVING_PLATFORM_SPEED;

            body.setDragX(0);
        }

        if (blocked.right)
        {
            this.currentAcceleration = -MOVING_PLATFORM_SPEED;

            body.setDragX(0);
        }

        if(acceleration.x > 0 && blocked.none)
        {
            const rightTile = this.scene.colliderLayer.getTileAtWorldXY(body.right + 12, bottom);

            if(rightTile?.collideLeft)
            {
                this.currentAcceleration = 0;

                body.setDragX(MOVING_PLATFORM_SPEED);
            }
        }

        if(acceleration.x < 0 && blocked.none)
        {
            const leftTile = this.scene.colliderLayer.getTileAtWorldXY(body.left - 12, bottom);

            if(leftTile?.collideRight)
            {
                this.currentAcceleration = 0;

                body.setDragX(MOVING_PLATFORM_SPEED);
            }
        }

        body.setAccelerationX(this.currentAcceleration);
    }
}