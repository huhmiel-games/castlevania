import { PLAYERS_NAMES } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";

export class MedusaIA implements IEnemyAI
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
        const { body, buttons, active } = this.parent;

        const { left, right } = buttons;

        const { center } = body;

        const { now } = this.scene.time;

        if (!active) return;

        if (left.isUp && right.isUp && active && this.parent.isInsideCameraByPixels(64))
        {
            this.parent.resetAllButtons();

            const player = this.scene.getClosestAlivePlayer(this.parent.damageBody);

            if (player.damageBody.x < center.x)
            {
                left.setDown(now);

                return;
            }

            if (player.damageBody.x > center.x)
            {
                right.setDown(now);

                return;
            }
        }

        if (active && this.parent.isOutsideCameraByPixels(128))
        {
            this.parent.killAndRespawn();
        }
    }

    reset()
    {

    }
}