import { DEPTH } from "../constant/depth";
import { Enemy } from "../entities/enemies/Enemy";
import GameScene from "../scenes/GameScene";
import { TileSpriteConfig } from "../types/types";

export default class SpikeScrew extends Phaser.GameObjects.TileSprite
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    private parent: Enemy;
    private changeFrameTime: number = 0;
    private animFrameNumber: number = 0;
    constructor(config: TileSpriteConfig)
    {
        super(config.scene, config.x, config.y, config.width, config.height, config.textureKey, config.frameKey);

        this.scene.add.existing(this);

        this.parent = config.parent;

        this.setName('spikeScrew')
            .setOrigin(0.5, 0)
            .setDepth(DEPTH.GROUND_LAYER)
    }

    preUpdate(time: number, delta: number): void
    {
        this.height = this.parent.y - this.y;

        if (this.changeFrameTime < time)
        {
            this.animFrameNumber = 1 - this.animFrameNumber;

            this.setFrame(`screw_${this.animFrameNumber}`);

            this.changeFrameTime = time + 120;
        }
    }
}