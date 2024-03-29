import { PLAYERS_NAMES } from "../../constant/config";
import { Enemy } from "../entities/Enemy";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";

export class GhostIA implements IEnemyAI
{
    parent: Enemy;
    scene: GameScene;
    private isChasing: boolean = false;
    private isActive: boolean = false;
    constructor(parent: Enemy)
    {
        this.parent = parent;
        this.scene = parent.scene;
        this.parent.setVisible(false);
        this.parent.body.reset(this.parent.body.x, this.parent.body.y + 8)
    }

    execute()
    {
        const { body } = this.parent;

        const player = this.scene.getPlayerByName(PLAYERS_NAMES.A);

        const distance = Phaser.Math.Distance.BetweenPoints(player, this.parent);

        if (distance > 40 && !this.isChasing && !this.isActive)
        {
            return;
        }
        if(!this.isActive && player.body.bottom <= body.top)
        {
            this.isActive = true;
            this.scene.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.parent.setVisible(true);
                    this.isChasing = true;
                }
            });
        }

        if (player.body.center.x < this.parent.body.center.x)
        {
            this.parent.setFlipX(true);
        }
        else
        {
            this.parent.setFlipX(false);
        }

        if (this.isChasing && this.parent.body.drag.x !== 0)
        {
            this.parent.body.setDrag(0, 0)
                .setAllowGravity(false)
                .setMaxVelocity(this.parent.physicsProperties.speed, this.parent.physicsProperties.speed)
        }

        if(this.isActive && this.isChasing){
            const dx = player.damageBody.body.center.x - this.parent.body.center.x;
            const dy = player.damageBody.body.center.y - this.parent.body.center.y;
    
            this.parent.body.setVelocity(dx, dy);
        }
    }

    reset()
    {

    }
}