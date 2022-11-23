import State from '../../../utils/State'
import GameScene from '../../../scenes/GameScene';
import { Entity } from '../../Entity';
import StateMachine from '../../../utils/StateMachine';
import { EPossibleState } from '../../../constant/character';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class MoveDownState
 * @extends {State}
 */
export default class MoveDownState extends State
{
    private stateMachine: StateMachine;
    public enter (scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.anims.play(character.animList.DOWN!, true);

        character.body.setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff, 0).setAcceleration(0, character.physicsProperties.acceleration);
    }

    public execute (scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b,  start, select } = character.buttons;

        const { blocked, touching } = character.body;

        const { now } = scene.time;

        const nextState = character.getDirection();

        if (nextState !== EPossibleState.DOWN)
        {
            this.stateMachine.transition(nextState, this.stateMachine.state);
        }
    }
}