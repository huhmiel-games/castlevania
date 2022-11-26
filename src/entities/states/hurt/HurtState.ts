import { EPossibleState } from "../../../constant/character";
import GameScene from "../../../scenes/GameScene";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class HurtState
 * @extends {State}
 */
export default class HurtState extends State
{
    private hitTime: number;
    public stateMachine: StateMachine;

    public enter (scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        // Stop player
        character.body.setDrag(0);

        this.hitTime = now;

        const { x, y } = character.body.acceleration;

        character.body.setAcceleration(x * -1, y * -1);

        character.anims.play(character.animList.HURT!, true);
    }

    public execute (scene: GameScene, character: Entity)
    {
        const { blocked } = character.body;

        const { now } = scene.time;

        if (this.hitTime + 600 < now && !character.physicsProperties.isDead)
        {
            character.body.setAcceleration(0, 0);

            // return to idle state
            this.stateMachine.transition(EPossibleState.IDLE, this.stateMachine.state);

            return;
        }
    }
}