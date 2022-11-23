import { TCharacterConfig } from "../../types/types";
import StateTimestamp from "../../utils/StateTimestamp";
import { Entity } from "../Entity";
import enemyJSON from '../../data/enemy.json';

export class Enemy extends Entity
{
    stateTimestamp: StateTimestamp;
    ai: { state: string; duration: number; }[];
    currentStateIndex: number = 0;

    constructor (config: TCharacterConfig)
    {
        super(config)

        this.scene.physics.world.enable(this);

        this.scene.add.existing(this);

        this.setStatusSpeed(enemyJSON.status.speed);
        this.setStatusAcceleration(enemyJSON.status.acceleration);
        this.ai = enemyJSON.ai;

        this.body.setMaxSpeed(this.physicsProperties.speed);
        this.handleNextState()
    }

    public preUpdate (time: number, delta: number)
    {
        super.preUpdate(time, delta);

        
    }

    handleNextState ()
    {
        const nextState = this.ai[this.currentStateIndex]
        this.scene.time.addEvent({
            delay: nextState.duration,
            callback: () =>
            {
                for (let key in this.buttons)
                {
                    this.buttons[key].setUp()
                }

                this.buttons[nextState.state].setDown();

                this.currentStateIndex + 1 < this.ai.length ? this.currentStateIndex += 1 : this.currentStateIndex = 0;

                this.handleNextState();
            }
        })
    }
}