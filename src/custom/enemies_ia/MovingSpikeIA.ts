import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";
import { DEPTH } from "../../constant/depth";
import SpikeScrew from "../../gameobjects/SpikeScrew";
import { ATLAS_NAMES } from "../../constant/config";

export class MovingSpikeIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.parent.setDepth(DEPTH.FRONT_LAYER);

        this.parent.body.setMaxVelocityX(0)
            .setAllowGravity(false)
            .setDragY(0)
            .setVelocityY(40);

        new SpikeScrew({scene: this.scene,
            x: this.parent.x,
            y: this.parent.y - 32,
            width: 6,
            height: 16,
            textureKey: ATLAS_NAMES.ITEMS,
            frameKey: 'screw_0',
            parent: this.parent
        })
    }

    execute()
    {
        const { body, active } = this.parent;

        const { blocked } = body;

        if (!active || this.parent.isOutsideCameraByPixels(256))
        {
            return;
        }

        if (blocked.down)
        {
            body.setVelocityY(-40);

            return;
        }

        if (blocked.up)
        {
            body.setVelocityY(40);

            return;
        }

        if(!blocked.down && !blocked.up && body.velocity.y === 0)
        {
            body.setVelocityY(40);
        }
    }

    reset()
    {

    }
}