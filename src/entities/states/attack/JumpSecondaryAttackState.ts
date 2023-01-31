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
 * @class JumpSecondaryAttackState
 * @extends {State}
 */
export default class JumpSecondaryAttackState extends State
{
    public stateMachine: StateMachine;
    private groundYPosition: number;
    public enter(scene: GameScene, character: Entity, groundYPosition?: number)
    {
        log(character.name + ' JUMP SECONDARY ATTACK STATE');

        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        this.groundYPosition = groundYPosition || character.body.bottom;

        character.secondaryAttack();

        character.anims.play(character.animList.JUMP_SECONDARY_ATTACK!, true);

        character.body.setAcceleration(0)
            .setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff, 0);
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, b } = character.buttons;

        const { blocked, bottom } = character.body;

        // End of jump
        if (this.groundYPosition - 32 > bottom || b.isUp)
        {
            this.stateMachine.transition(EStates.JUMP_MOMENTUM_SECONDARY_ATTACK, this.stateMachine.state);

            return;
        }

        // If touching the ceiling
        if (blocked.up)
        {
            this.stateMachine.transition(EStates.FALL_SECONDARY_ATTACK, this.stateMachine.state);

            return;
        }

        if (left.isDown && right.isUp)
        {
            character.body.setAcceleration(-character.physicsProperties.acceleration * 5, -character.physicsProperties.acceleration * 15);
        }

        if (right.isDown && left.isUp)
        {
            character.body.setAcceleration(character.physicsProperties.acceleration * 5, -character.physicsProperties.acceleration * 15);
        }

        if (b.isDown)
        {
            character.body.setAccelerationY(-character.physicsProperties.acceleration * 15);
        }
    }
}