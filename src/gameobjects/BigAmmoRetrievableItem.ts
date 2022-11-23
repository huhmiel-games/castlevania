import { DEPTH } from "../constant/depth";
import GameScene from "../scenes/GameScene";
import { BaseItemConfig } from "../types/types";
import BaseRetrievableItem from "./BaseRetrievableItem";

export default class BigAmmoRetrievableItem extends BaseRetrievableItem
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    constructor(config: BaseItemConfig)
    {
        super(config);

        this.setName('bigHeart').setOrigin(0, 0).setDepth(DEPTH.GROUND_LAYER);

        this.scene.physics.world.enable(this);

        this.body.setAllowGravity(true).setImmovable(true);
    }
}