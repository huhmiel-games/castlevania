import State from '../../../utils/State'
import GameScene from '../../../scenes/GameScene';
import { Entity } from '../../Entity';
import StateMachine from '../../../utils/StateMachine';
import { EStates } from '../../../constant/character';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class MoveDownState
 * @extends {State}
 */
export default class MoveDownState extends State
{
    public stateMachine: StateMachine;
    public enter (scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.anims.play(character.animList.DOWN!, true);

        character.body.setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff, 0)
        .setAcceleration(0, character.physicsProperties.acceleration);
    }

    public execute (scene: GameScene, character: Entity)
    {
        const { up, down, a } = character.buttons;

        const { now } = scene.time;

        if (character.canUse(EStates.SECONDARY_ATTACK) && a.isDown && up.isDown && a.getDuration(now) < 128)
        {
            this.stateMachine.transition(EStates.SECONDARY_ATTACK, this.stateMachine.state);

            return;
        }

        if (up.isUp && down.isUp && character.canUse(EStates.IDLE))
        {
            this.stateMachine.transition(EStates.IDLE, this.stateMachine.state);
        }

        if(down.isUp && up.isDown && character.canUse(EStates.UP))
        {
            this.stateMachine.transition(EStates.UP, this.stateMachine.state);
        }
    }
}