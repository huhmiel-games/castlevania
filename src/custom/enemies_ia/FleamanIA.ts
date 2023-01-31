import { EStates } from "../../constant/character";
import { PLAYERS_NAMES, TILE_SIZE } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";

export class FleamanIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    private jumpTime: number = 0;
    private isChasing: boolean = false;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;

        if (this.parent.body.center.x > this.scene.getPlayerByName(PLAYERS_NAMES.A).body.center.x)
        {
            this.parent.setFlipX(true);
        }
        else
        {
            this.parent.setFlipX(false);
        }
    }

    execute()
    {
        const { body, buttons, config } = this.parent;

        const { b } = buttons;

        const { center, blocked } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (!this.isChasing && cam.worldView.contains(center.x, center.y))
        {
            const player = this.scene.getPlayerByName(PLAYERS_NAMES.A);

            const distance = Math.abs(center.x - player.body.center.x);

            if (center.x > player.body.center.x)
            {
                this.parent.setFlipX(true);
            }

            if (distance < 128)
            {
                this.isChasing = true;
            }

            return;
        }

        if (!this.isChasing) return;

        if (this.jumpTime < now
            && b.isUp
            && cam.worldView.contains(center.x, center.y)
            && this.parent.stateMachine.state === EStates.IDLE)
        {
            const player = this.scene.getPlayerByName(PLAYERS_NAMES.A);

            const chanceToAttack = Phaser.Math.RND.between(0, 100);

            if (center.x > player.body.center.x && chanceToAttack > 25)
            {
                const distance = Phaser.Math.Distance.BetweenPoints(player.body.center, center);

                if (distance < TILE_SIZE * 2 || distance > TILE_SIZE * 7)
                {
                    config.physicsProperties.jumpHeight = 3;
                }

                body.setDragX(0).setVelocityX(-this.parent.physicsProperties.speed);
                this.parent.setFlipX(true);

                b.setDown(now);
            }

            if (center.x < player.body.center.x && chanceToAttack > 25)
            {
                const distance = Phaser.Math.Distance.BetweenPoints(player.body.center, center) / 2;

                if (distance < TILE_SIZE * 2 || distance > TILE_SIZE * 7)
                {
                    config.physicsProperties.jumpHeight = 3;
                }

                body.setDragX(0).setVelocityX(this.parent.physicsProperties.speed);
                this.parent.setFlipX(false);

                b.setDown(now);
            }

            this.scene.time.addEvent({
                delay: config.physicsProperties.jumpHeight === 0.5 ? 96 : 192,
                callback: () =>
                {
                    b.setUp(this.scene.time.now);

                    config.physicsProperties.jumpHeight = 0.5;
                }
            });

            this.jumpTime = now + 300;
        }

        if (blocked.down && b.isUp)
        {
            body.stop();
        }
    }

    reset()
    {

    }
}
