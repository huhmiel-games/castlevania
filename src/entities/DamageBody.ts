import GameScene from "../scenes/GameScene";
import { TDamageBodyConfig } from "../types/types";
import { Entity } from "./Entity";

export default class DamageBody extends Phaser.GameObjects.Image
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    public parent: Entity;
    public oneShotEnemy: boolean = false;
    public invincible: boolean = false;
    public hitAndDie: boolean = false;
    public hasCustomZoneHit: boolean = false; // set to true to use a the customZoneHit
    public customZoneHit: [number, number]; // [top y is the head, bottom y is the foots]
    public damage: number = 0; // for enemies making damage with their body, not used for this game
    constructor(config: TDamageBodyConfig)
    {
        super(config.scene, config.x, config.y, 'whitePixel', 0);

        this.parent = config.parent;

        this.scene.physics.world.enable(this);

        this.setActive(true).setOrigin(0.5, 1);

        this.body.setAllowGravity(false).setEnable(true).setSize(config.width, config.height);

        this.customZoneHit = [0, this.body.height];

        this.onPostUpdateEvent();
    }

    private onPostUpdateEvent()
    {
        this.scene.events.on(Phaser.Scenes.Events.POST_UPDATE, this.followParent, this);
    }

    private followParent()
    {
        const { body } = this.parent;

        if (!body || !this.body) return;

        const offsetY = this.parent.config?.physics.damageBody.offsetY || 0;

        this.setPosition(body.center.x, body.bottom - this.body.height / 2 + offsetY);
    }

    public changeBodySize(width: number, height: number)
    {
        this.body.setSize(width, height);
    }

    /**
     * Check partial hit zone
     */
    public checkZoneHit(y: number)
    {        
        if (y > this.body.top + this.customZoneHit[0] && y < this.body.top + this.customZoneHit[1])
        {
            return true;
        }

        return false;
    }
}