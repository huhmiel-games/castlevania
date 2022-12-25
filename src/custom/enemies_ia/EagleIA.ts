import { InputController } from "../../inputs/InputController";
import enemyJSON from '../../data/enemy.json';
import { PLAYER_A_NAME } from "../../constant/config";
import { Enemy } from "../../entities/enemies/Enemy";
import { IEnemyAI } from "../../interfaces/interface";
import GameScene from "../../scenes/GameScene";
import { FleamanIA } from "./FleamanIA";

export class EagleIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    isFlying: boolean = false;
    direction: string;
    hasFleaman: boolean = true;
    fleaman: Enemy | undefined;
    constructor(parent: Enemy)
    {
        this.parent = parent;

        this.scene = parent.scene;

        this.handleFly();
    }

    createFleaman()
    {
        if (!this.parent.active || !this.scene) return;

        const enemyJSONConfig = JSON.parse(JSON.stringify(enemyJSON.fleaman));
        enemyJSONConfig.status.position.x = this.parent.body.center.x;
        enemyJSONConfig.status.position.y = this.parent.body.center.y;

        const inputController = InputController.getInstance();

        this.fleaman = new Enemy({
            scene: this.scene,
            x: this.parent.body.center.x,
            y: this.parent.body.center.y,
            texture: 'enemies',
            frame: enemyJSONConfig.config.defaultFrame,
            buttons: inputController.getNewButtons()
        }, enemyJSONConfig);

        this.fleaman.setName('fleaman');
        this.fleaman.setActive(false);
        this.fleaman.setAi(new FleamanIA(this.fleaman));

        this.scene.enemiesDamageBody.push(this.fleaman.damageBody);
    }

    handleFly()
    {
        this.parent.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        {
            if (!this.parent.active) return;

            this.parent.resetAllButtons();

            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            const distance = Math.abs(player.body.center.x - this.parent.body.center.x);

            if (distance < 64 && this.fleaman)
            {
                this.fleaman.setActive(true);

                this.fleaman = undefined;
            }

            this.scene.time.addEvent({
                delay: 200,
                callback: () =>
                {
                    if (!this.parent.active) return;

                    const { left, right } = this.parent.buttons;

                    const { now } = this.scene.time;

                    if (this.direction === 'right')
                    {
                        right.setDown(now);
                    }

                    if (this.direction === 'left')
                    {
                        left.setDown(now);
                    }

                    this.handleFly();
                }
            });
        });
    }

    execute()
    {
        const { body, buttons } = this.parent;

        const { left, right } = buttons;

        const { center } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (this.fleaman)
        {
            this.fleaman.body.reset(this.parent.body.center.x, this.parent.body.center.y + 10);
        }

        if (!this.isFlying && left.isUp && right.isUp && this.parent.active && !cam.worldView.contains(center.x, center.y))
        {
            this.parent.resetAllButtons();

            this.createFleaman();

            this.isFlying = true;

            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            if (player.body.center.x < center.x)
            {
                left.setDown(now);

                this.direction = 'left';

                return;
            }

            if (player.body.center.x > center.x)
            {
                right.setDown(now);

                this.direction = 'right';

                return;
            }
        }

        if (this.parent.active && this.parent.isOutsideCameraByPixels(64))
        {
            this.fleaman?.kill();

            this.parent.killAndRespawn();
        }
    }

    reset()
    {
        this.isFlying = false;

        if (this.fleaman)
        {
            this.fleaman.kill();
        }

        this.handleFly();
    }
}