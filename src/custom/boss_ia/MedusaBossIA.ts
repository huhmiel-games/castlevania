import { PLAYER_A_NAME } from "../../constant/config";
import { Boss } from "../../entities/enemies/Boss";
import { Enemy } from "../../entities/enemies/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI, TEntityConfig } from "../../types/types";
import enemyJSON from '../../data/enemy.json';
import { SnakeIA } from "./SnakeIA";
import { InputController } from "../../inputs/InputController";
import { EPossibleState } from "../../constant/character";


export class MedusaBossIA implements IEnemyAI
{
    parent: Boss;
    scene: GameScene;
    private phase: 0 | 1 | 2 = 0;
    private phaseCount: number = 0;
    constructor(parent: Boss)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.parent.damageBody.setActive(false)
        this.parent.setVisible(false);

        this.parent.body.setAllowGravity(false);

        this.parent.anims.play(this.parent.animList.IDLE!);

        this.scene.add.image(1904, 472, 'enemies', 'medusa-statue_0').setName('medusaStatue').setDepth(this.parent.depth - 1);
    }

    execute()
    {
        const { body, anims, animList } = this.parent;

        const { center } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (!cam.worldView.contains(center.x, center.y))
        {
            return;
        }

        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

        if (player.body.center.x < 1862 && !this.scene.isBossBattle)
        {
            this.parent.startBattle();

            this.scene.time.addEvent({
                delay: 1000,
                callback: () =>
                {
                    const statue = this.scene.children.getByName('medusaStatue') as Phaser.GameObjects.Image;

                    statue.setFrame('medusa-statue_1');

                    this.parent.damageBody.setActive(true)
                    this.parent.setActive(true).setVisible(true);

                    this.phase = 1;

                    this.phaseCount = now + 3000;
                }
            });
        }

        if (this.phase === 1 && this.parent.stateMachine.state !== EPossibleState.STUN)
        {
            anims.play(animList.FLY!, true);

            const dx = player.damageBody.body.center.x - this.parent.body.center.x;
            const dy = player.damageBody.body.center.y - this.parent.body.center.y;

            this.parent.body.setMaxVelocity(20, 10).setDrag(0, 0);

            this.parent.body.setAcceleration(dx, dy);
        }

        if (this.phase === 1 && this.phaseCount < now && this.parent.stateMachine.state !== EPossibleState.STUN)
        {
            this.phaseCount = now + 3000;

            this.addSnake();
        }
    }

    addSnake()
    {
        const inputController = InputController.getInstance();

        const enemyJSONConfig: TEntityConfig = JSON.parse(JSON.stringify(enemyJSON['snake']));

        const snake = new Enemy({
            scene: this.scene,
            x: this.parent.body.center.x,
            y: this.parent.body.center.y,
            texture: 'enemies',
            frame: 'snake_0',
            buttons: inputController.getNewButtons()
        }, enemyJSONConfig);

        snake.setName('snake');

        snake.setAi(new SnakeIA(snake));

        this.scene.enemiesDamageBody.push(snake.damageBody)
    }

    reset()
    {

    }
}
