import { InputController } from "../../inputs/InputController";
import enemyJSON from '../../data/enemy.json';
import { PLAYER_A_NAME } from "../../constant/config";
import { Enemy } from "../../entities/enemies/Enemy";
import GameScene from "../../scenes/GameScene";
import { FleamanIA } from "./FleamanIA";
import { IEnemyAI } from "../../types/types";

export class EagleIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    isFlying: boolean = false;
    direction: string;
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

            if (distance > 32 && distance < 120 && this.fleaman)
            {
                this.fleaman.setActive(true);

                this.fleaman = undefined;
            }

            this.scene.time.addEvent({
                delay: 64,
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

        if (this.fleaman && this.fleaman.body)
        {
            this.fleaman.body.reset(this.parent.body.center.x, this.parent.body.center.y + 10);
        }

        if (!this.isFlying && left.isUp && right.isUp && this.parent.active && !cam.worldView.contains(center.x, center.y))
        {
            this.parent.resetAllButtons();

            if(this.fleaman === undefined ||this.fleaman.active === false)
            {
                this.createFleaman();
            }

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

        if (this.parent.active && this.parent.isOutsideCameraByPixels(128))
        {
            this.fleaman?.kill();

            this.parent.killAndRespawn();
        }
    }

    private randomPositionX(): number
    {
        return Phaser.Math.RND.integerInRange(16, 128);
    }

    reset()
    {
        this.isFlying = false;

        if (this.fleaman)
        {
            this.fleaman.kill();
        }

        const rnd = Phaser.Math.RND.between(0, 100);
        const x = rnd > 25 ? this.scene.cameras.main.worldView.right + this.randomPositionX() : this.scene.cameras.main.worldView.left - this.randomPositionX();
        this.parent.body?.reset(x, this.parent.body.y);

        this.handleFly();
    }
}