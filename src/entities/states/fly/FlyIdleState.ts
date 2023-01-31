import State from '../../../utils/State'
import GameScene from '../../../scenes/GameScene';
import { Entity } from '../../Entity';
import StateMachine from '../../../utils/StateMachine';
import { EStates } from '../../../constant/character';
import { log } from '../../../utils/log';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class FlyState
 * @extends {State}
 */
export default class FlyIdleState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        const {stateTimestamp, animList, physicsProperties, body} = character;

        const {acceleration, dragCoeff} = physicsProperties;

        stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.anims.play(animList.FLY!, true);

        body.setDrag(acceleration * dragCoeff, acceleration * dragCoeff)
            .setAcceleration(0, 0);

        log(character.name + ' FLY IDLE STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right } = character.buttons;

        if (character.canUse(EStates.FLY_LEFT) && left.isDown)
        {
            this.stateMachine.transition(EStates.FLY_LEFT, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.FLY_RIGHT) && right.isDown)
        {
            this.stateMachine.transition(EStates.FLY_RIGHT, this.stateMachine.state);

            return;
        }
    }
}