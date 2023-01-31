import { PLAYERS_NAMES } from "../../constant/config";
import { Boss } from "../entities/Boss";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";
import { EPossibleState } from "../../constant/character";


export class DeathIA implements IEnemyAI
{
    parent: Boss;
    scene: GameScene;
    private phase: 0 | 1 | 2 = 0;
    private phaseCount: number = 0;
    private attackTime: number = 0;
    constructor(parent: Boss)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.parent.damageBody.setActive(false)
        this.parent.setVisible(false);

        this.parent.body.setAllowGravity(false).setEnable(false);

        this.parent.anims.play(this.parent.animList.IDLE!);
    }

    execute()
    {
        const { body, anims, animList, buttons, stateMachine } = this.parent;

        const { left, right, up, a, b } = buttons;

        const { blocked, center, velocity } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (!cam.worldView.contains(center.x, center.y))
        {
            return;
        }

        const player = this.scene.getPlayerByName(PLAYERS_NAMES.A);

        // starts the battle
        if (player.body.center.x < 487 * 16 && !this.scene.isBossBattle)
        {
            this.parent.startBattle();

            this.scene.time.addEvent({
                delay: 1000,
                callback: () =>
                {
                    this.parent.damageBody.setActive(true);
                    this.parent.setActive(true).setVisible(true);
                    this.parent.body.setEnable(true);

                    this.phase = 1;

                    this.phaseCount = now + 3000;

                    left.setDown(now);

                    this.attackTime = now + 1000;
                }
            });
        }

        // handle flipX
        if (velocity.x < 0)
        {
            this.parent.setFlipX(true);
        }
        else
        {
            this.parent.setFlipX(false);
        }

        // handle side walls
        if (blocked.left)
        {
            left.setUp(now);
            right.setDown(now);
        }

        if (blocked.right)
        {
            right.setUp(now);
            left.setDown(now);
        }

        // handle jump
        if (stateMachine.state === EPossibleState.IDLE && b.isUp && this.scene.isBossBattle)
        {
            b.setDown(now);

            this.scene.time.addEvent({
                delay: 950,
                callback: () =>
                {
                    b.setUp(now);
                }
            })
        }

        // handle attack
        if (this.phase === 1
            && this.attackTime < now
            && (stateMachine.state === EPossibleState.JUMP_MOMENTUM || stateMachine.state === EPossibleState.FALL)
        )
        {
            if (up.isUp)
            {
                up.setDown(now);
                a.setDown(now);
            }
            else
            {
                up.setUp(now);
                a.setUp(now);
            }

            this.attackTime = now + 1200;
        }
    }

    reset()
    {

    }
}
