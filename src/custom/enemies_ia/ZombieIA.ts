import { EPossibleState } from "../../constant/character";
import { PLAYER_A_NAME } from "../../constant/config";
import { Enemy } from "../../entities/enemies/Enemy";
import { IEnemyIA } from "../../interfaces/interface";
import GameScene from "../../scenes/GameScene";

export class ZombieIA implements IEnemyIA
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
            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            if (this.parent.canUse(EPossibleState.LEFT) && player.damageBody.x < this.parent.body.x)
            {
                this.parent.resetAllButtons();

                buttons.left.setDown(now);

                return;
            }

            if (this.parent.canUse(EPossibleState.RIGHT) && player.damageBody.x > this.parent.body.x)
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