import { DEPTH } from "../../constant/depth";
import GameScene from "../../scenes/GameScene";
import { TSpriteConfig } from "../../types/types";

export class Thunder extends Phaser.GameObjects.Image
{
    scene: GameScene
    constructor(config: TSpriteConfig)
    {
        super(config.scene, config.x, config.y, config.texture, config.frame);

        this.scene = config.scene;

        this.setOrigin(0, 0).setDepth(DEPTH.GROUND_LAYER).setVisible(false);

        this.scene.add.existing(this);
    }

    showThunder()
    {
        if (this.visible || !this.active) return;

        this.setVisible(true);

        this.scene.playSound(34, 1);

        this.scene.cameras.main.flash(75);

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            yoyo: true,
            duration: 150
        });

        this.scene.time.addEvent({
            delay: 300,
            callback: () =>
            {
                this?.setVisible(false);

                this?.destroy();
            }
        });
    }
}