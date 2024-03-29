import State from '../../../utils/State'
import GameScene from '../../../scenes/GameScene';
import { Entity } from '../../Entity';
import StateMachine from '../../../utils/StateMachine';
import { EStates } from '../../../constant/character';
import { RangedWeapon } from '../../../types/types';
import { Enemy } from '../../../custom/entities/Enemy';
import { log } from '../../../utils/log';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class SecondaryAttackState
 * @extends {State}
 */
export default class SecondaryAttackState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity)
    {
        log(character.name + ' SECONDARY ATTACK STATE');

        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.secondaryAttack();

        character.anims.play(character.animList.SECONDARY_ATTACK!, true);

        character.body.setAcceleration(0).setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff, 0);
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { isAttacking } = character.physicsProperties;

        if (!isAttacking)
        {
            this.stateMachine.transition(EStates.IDLE, this.stateMachine.state);

            return;
        }
    }
}