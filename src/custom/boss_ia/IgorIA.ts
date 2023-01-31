import { EPossibleState } from "../../constant/character";
import { PLAYERS_NAMES } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";
import { WEAPON_NAMES } from "../../constant/weapons";

export class IgorIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    private jumpTime: number = 0;
    private isChasing: boolean = false;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.parent.setFlipX(true);

        this.parent.body.setMaxVelocityY(0);

        this.parent.addSecondaryWeapon(WEAPON_NAMES.FIREBALL);
    }

    execute()
    {
        const { body, buttons, config } = this.parent;

        const { left, right, up, a, b } = buttons;

        const { center, blocked } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (!cam.worldView.contains(body.right, center.y)) return;

        if (!this.isChasing && this.scene.isBossBattle)
        {
            this.parent.config.physicsProperties.speed = 50;
            this.parent.body.setMaxVelocity(50, 550);

            this.isChasing = true;

            return;
        }

        if (!this.isChasing) return;

        const player = this.scene.getPlayerByName(PLAYERS_NAMES.A);

        if (this.jumpTime < now
            && b.isUp
            && (blocked.down || blocked.left || blocked.right)
        )
        {
            const chanceToAttack = Phaser.Math.RND.between(0, 100);

            if (chanceToAttack > 15)
            {
                const direction = Phaser.Math.RND.frac();

                if (direction < 0.5 && !blocked.left)
                {
                    left.setDown(now);
                }

                if (direction > 0.5 && !blocked.right)
                {
                    right.setDown(now);
                }

                b.setDown(now);
            }

            this.scene.time.addEvent({
                delay: 1000,
                callback: () =>
                {
                    this.parent.resetAllButtons();

                    config.physicsProperties.jumpHeight = 5;
                }
            });

            this.jumpTime = now + 1200;
        }

        if (a.isUp && this.parent.stateMachine.state === EPossibleState.JUMP_MOMENTUM)
        {
            up.setDown(now);

            a.setDown(now);
        }

        if (blocked.down && center.x < player.body.center.x)
        {
            this.parent.setFlipX(false);
        }

        if (blocked.down && center.x > player.body.center.x)
        {
            this.parent.setFlipX(true);
        }
    }

    reset()
    {

    }
}
