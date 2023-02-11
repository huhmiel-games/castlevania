import { EStates } from "../../constant/character";
import { PLAYERS_NAMES } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";

export class SnakeIA implements IEnemyAI
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

        const { center, blocked } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (blocked.left && cam.worldView.contains(center.x, center.y))
        {
            this.parent.resetAllButtons();

            right.setDown(now);

            return;
        }

        if (blocked.right && cam.worldView.contains(center.x, center.y))
        {
            this.parent.resetAllButtons();

            left.setDown(now);

            return;
        }

        if (left.isUp && right.isUp)
        {
            const player = this.scene.getClosestPlayer(this.parent.damageBody);

            if (this.parent.canUse(EStates.LEFT) && player.damageBody.x < this.parent.body.x)
            {
                this.parent.resetAllButtons();

                buttons.left.setDown(now);

                return;
            }

            if (this.parent.canUse(EStates.RIGHT) && player.damageBody.x > this.parent.body.x)
            {
                this.parent.resetAllButtons();

                buttons.right.setDown(now);

                return;
            }
        }
    }

    reset()
    {

    }
}