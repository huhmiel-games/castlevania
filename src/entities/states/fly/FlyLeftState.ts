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
export default class FlyLeftState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.setFlipX(true);

        character.anims.play(character.animList.FLY!, true);

        character.body.setDrag(0, 0);

        log(character.name + ' FLY LEFT STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        const { left } = character.buttons;

        const { speed, sinHeight } = character.physicsProperties;

        const speedY = Math.sin(now / 400) * sinHeight! * TILE_SIZE;

        character.body.setVelocity(-speed, speedY);

        if (character.canUse(EStates.FLY_IDLE) && left.isUp)
        {
            this.stateMachine.transition(EStates.FLY_IDLE, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.IDLE) && left.isUp)
        {
            this.stateMachine.transition(EStates.IDLE, this.stateMachine.state);

            return;
        }
    }
}