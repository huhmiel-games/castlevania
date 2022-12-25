import GameScene from "../../../scenes/GameScene";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class DeathState
 * @extends {State}
 */
export default class DeathState extends State
{
    public stateMachine: StateMachine;

    public enter (scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        // Stop player
        character.body.setDrag(0);

        character.body.setAcceleration(0).setVelocity(0);

        character.anims.play(character.animList.DEAD!);

        console.log(character.name + ' DEATH STATE')
    }

    public execute (scene: GameScene, character: Entity)
    {

    }
}