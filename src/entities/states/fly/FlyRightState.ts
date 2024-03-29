import State from '../../../utils/State'
import GameScene from '../../../scenes/GameScene';
import { Entity } from '../../Entity';
import StateMachine from '../../../utils/StateMachine';
import { EStates } from '../../../constant/character';
import { TILE_SIZE } from '../../../constant/config';
import { log } from '../../../utils/log';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class FlyState
 * @extends {State}
 */
export default class FlyRightState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.setFlipX(false);

        character.anims.play(character.animList.FLY!, true);

        character.body.setDrag(0, 0);

        log(character.name + ' FLY RIGHT STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        const { right } = character.buttons;

        const { speed, sinHeight } = character.physicsProperties;

        const speedY = Math.sin(now / 400) * sinHeight! * TILE_SIZE;

        character.body.setVelocity(speed, speedY);

        if (character.canUse(EStates.FLY_IDLE) && right.isUp)
        {
            this.stateMachine.transition(EStates.FLY_IDLE, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.IDLE) && right.isUp)
        {
            this.stateMachine.transition(EStates.IDLE, this.stateMachine.state);

            return;
        }
    }
}