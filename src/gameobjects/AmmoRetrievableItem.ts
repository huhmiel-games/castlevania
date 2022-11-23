import { DEPTH } from "../constant/depth";
import GameScene from "../scenes/GameScene";
import { BaseItemConfig } from "../types/types";
import BaseRetrievableItem from "./BaseRetrievableItem";

export default class AmmoRetrievableItem extends BaseRetrievableItem
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    constructor(config: BaseItemConfig)
    {
        super(config);

        this.body.setImmovable(false).setGravityY(-990);
    }

    public preUpdate(time: number, delta: number)
    {
        if (!this.active) return;

        if (!this.body.blocked.down)
        {
            this.body.setVelocityX(Math.sin(time / 200) * 32);
        }
        else
        {
            this.body.stop();
        }
    }
}