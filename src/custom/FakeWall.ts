import { HEIGHT } from "../constant/config";
import GameScene from "../scenes/GameScene";
import { TSpriteConfig } from "../types/types";

export default class FakeWall extends Phaser.GameObjects.Image
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    private cam: Phaser.Cameras.Scene2D.Camera;

    private side: 'left' | 'right' = 'left';

    constructor(config: TSpriteConfig, side: 'left' | 'right')
    {
        super(config.scene, config.x, config.y, 'whitePixel', 0);

        this.scene.add.existing(this);

        this.scene.physics.world.enable(this);

        this.cam = this.scene.cameras.main;

        this.side = side;

        this.name = `fakeWall${side}`;

        this.setActive(true).setOrigin(0.5, 0.5);

        this.body.setAllowGravity(false)
            .setImmovable(true)
            .setEnable(true)
            .setSize(16, HEIGHT + 32);

        this.onPostUpdateEvent();
    }

    private onPostUpdateEvent()
    {
        this.scene?.events.on(Phaser.Scenes.Events.PRE_UPDATE, this.followParent, this);
    }

    private followParent()
    {
        if (this.side === 'left' && this.body?.center.x !== this.cam.worldView.x)
        {
            this.body?.reset(this.cam.worldView.x, this.cam.worldView.centerY)

        }
        else if (this.side === 'right' && this.body?.center.x !== this.cam.worldView.right)
        {
            this.body?.reset(this.cam.worldView.right, this.cam.worldView.centerY)
        }
    }
}
