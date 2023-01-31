import State from '../../../utils/State'
import GameScene from '../../../scenes/GameScene';
import { Entity } from '../../Entity';
import StateMachine from '../../../utils/StateMachine';
import { EStates } from '../../../constant/character';
import { RangedWeapon } from '../../../types/types';
import { log } from '../../../utils/log';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class StairSecondaryAttackState
 * @extends {State}
 */
export default class StairSecondaryAttackState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity, direction?: string)
    {
        log(character.name + ' STAIR SECONDARY ATTACK STATE');

        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.secondaryAttack();

        if (direction === 'up')
        {
            character.anims.play(character.animList.UPSTAIR_SECONDARY_ATTACK!, true);
        }
        else
        {
            character.anims.play(character.animList.DOWNSTAIR_SECONDARY_ATTACK!, true);
        }
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { isAttacking } = character.physicsProperties;

        if (!isAttacking)
        {
            this.stateMachine.transition(this.stateMachine.prevState, this.stateMachine.state);

            return;
        }
    }
}