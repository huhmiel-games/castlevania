import { PLAYERS_NAMES } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";

export class BatIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;
    }

    execute()
    {
        const { body, buttons } = this.parent;

        const { left, right } = buttons;

        const { center } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (left.isUp && right.isUp && this.parent.active && !cam.worldView.contains(center.x, center.y))
        {
            this.parent.resetAllButtons();

            const player = this.scene.getClosestPlayer(this.parent.damageBody);

            if (player.damageBody.x < this.parent.body.x)
            {
                left.setDown(now);

                return;
            }

            if (player.damageBody.x > this.parent.body.x)
            {
                right.setDown(now);

                return;
            }
        }

        if (this.parent.active && (this.parent.body.right < cam.worldView.left - 128 || this.parent.body.left > cam.worldView.right + 128))
        {
            this.parent.killAndRespawn();
        }
    }

    reset()
    {

    }
}