import { EPossibleState } from "../../constant/character";
import { PLAYER_A_NAME } from "../../constant/config";
import { Enemy } from "../../entities/enemies/Enemy";
import { IEnemyAI } from "../../interfaces/interface";
import GameScene from "../../scenes/GameScene";

export class BatIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;
    }

    decides()
    {
        const { body, buttons, stateMachine } = this.parent;

        const { left, right } = buttons;

        const { center, blocked } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (left.isUp && right.isUp && this.parent.active && !cam.worldView.contains(center.x, center.y))
        {
            this.parent.resetAllButtons();

            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

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