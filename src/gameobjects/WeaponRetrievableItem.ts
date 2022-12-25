import GameScene from "../scenes/GameScene";
import { BaseItemConfig } from "../types/types";
import BaseRetrievableItem from "./BaseRetrievableItem";

export default class WeaponRetrievableItem extends BaseRetrievableItem
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    constructor(config: BaseItemConfig)
    {
        super(config);

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
}