import { PLAYER_A_NAME } from "../../constant/config";
import { Enemy } from "../../entities/enemies/Enemy";
import { IEnemyAI } from "../../interfaces/interface";
import GameScene from "../../scenes/GameScene";

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

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (left.isUp && right.isUp && active && this.parent.isInsideCameraByPixels(64))
        {
            this.parent.resetAllButtons();

            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

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