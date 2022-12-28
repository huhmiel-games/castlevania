import { WIDTH } from "../constant/config";
import { DEPTH } from "../constant/depth";
import GameScene from "../scenes/GameScene";
import { TSpriteConfig } from "../types/types";

export class Orb extends Phaser.GameObjects.Sprite
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    constructor(config: TSpriteConfig)
    {
        super(config.scene, config.x, config.y, config.texture, config.frame);

        this.scene.add.existing(this);

        this.scene.physics.world.enable(this);

        this.body.setAllowGravity(true).setImmovable(true);

        this.anims.play('orb', true);

        this.setDepth(DEPTH.GROUND_LAYER).setName('orb');

        const cam = this.scene.cameras.main;

        this.body.setCircle(8);

        this.body.reset(cam.worldView.centerX, cam.worldView.centerY - 64);
    }

    preUpdate(time: number, delta: number): void
    {
        // if (this.body.blocked.down && this.body.allowGravity)
        // {
        //     this.body.setAllowGravity(false);
        // }
    }
}