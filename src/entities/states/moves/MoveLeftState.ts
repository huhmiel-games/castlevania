import State from '../../../utils/State'
import GameScene from '../../../scenes/GameScene';
import { Entity } from '../../Entity';
import StateMachine from '../../../utils/StateMachine';
import { EStates } from '../../../constant/character';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class MoveLeftState
 * @extends {State}
 */
export default class MoveLeftState extends State
{
    public stateMachine: StateMachine;
    public enter (scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.anims.play(character.animList.LEFT!, true);

        character.body.setDrag(0, character.physicsProperties.acceleration * character.physicsProperties.dragCoeff).setAcceleration(-character.physicsProperties.acceleration, 0);
    }

    public execute (scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b,  start, select } = character.buttons;

        const { blocked, touching } = character.body;

        const { now } = scene.time;

        const nextState = character.getDirection();

        if (nextState !== EStates.LEFT)
        {
            this.stateMachine.transition(nextState, this.stateMachine.state);
        }
    }
}