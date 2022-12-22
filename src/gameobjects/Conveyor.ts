import GameScene from "../scenes/GameScene";

export default class Conveyor extends Phaser.GameObjects.TileSprite
{
    scene: GameScene;
    body: Phaser.Physics.Arcade.Body;
    surfaceSpeed: Phaser.Math.Vector2;

    constructor(scene: GameScene, x: number, y: number, width: number, height: number)
    {
        super(scene, x, y, width, height, 'conveyor');

        this.scene = scene;

        this.scene.add.existing(this);

        this.setOrigin(0).setName('conveyor');

        this.scene.physics.add.existing(this, true);

        this.surfaceSpeed = new Phaser.Math.Vector2(0.5, 0);
    }

    setSpeed(x = 0.5)
    {
        this.surfaceSpeed.set(x, 0);

        return this;
    }

    reverse()
    {
        this.surfaceSpeed.negate();

        return this;
    }
}