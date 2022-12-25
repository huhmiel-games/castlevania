import State from '../../../utils/State'
import GameScene from '../../../scenes/GameScene';
import { Entity } from '../../Entity';
import StateMachine from '../../../utils/StateMachine';
import { EPossibleState } from '../../../constant/character';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class MoveUpState
 * @extends {State}
 */
export default class MoveUpState extends State
{
    public stateMachine: StateMachine;
    public enter (scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.anims.play(character.animList.UP!, true);

        character.body.setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff, 0)
        .setAcceleration(0, -character.physicsProperties.acceleration);
    }

    public execute (scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b,  start, select } = character.buttons;

        const { blocked, touching } = character.body;

        const { now } = scene.time;

        if (character.canUse(EPossibleState.SECONDARY_ATTACK) && a.isDown && up.isDown && a.getDuration(now) < 128)
        {
            this.stateMachine.transition(EPossibleState.SECONDARY_ATTACK, this.stateMachine.state);

            return;
        }

        if (up.isUp && down.isUp && character.canUse(EPossibleState.IDLE))
        {
            this.stateMachine.transition(EPossibleState.IDLE, this.stateMachine.state);
        }

        if(up.isUp && down.isDown && character.canUse(EPossibleState.DOWN))
        {
            this.stateMachine.transition(EPossibleState.DOWN, this.stateMachine.state);
        }
    }
}