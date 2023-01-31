import { PLAYERS_NAMES } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import enemyJSON from '../../data/enemy.json';
import { IEnemyAI } from "../../types/types";
import { ENEMY_NAMES } from "../../constant/character";
import { Curve } from "../../utils/Curve";

export class BoneDragonBodyIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.parent.setFlipX(true).setOrigin(0.4, 0.5);

        this.parent.body.setImmovable()
            .setMaxVelocity(0)
            .setGravityY(0)
            .setAllowGravity(false);
    }

    execute()
    {

    }

    reset()
    {

    }
}