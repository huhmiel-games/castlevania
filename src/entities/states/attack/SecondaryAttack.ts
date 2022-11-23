import State from '../../../utils/State'
import GameScene from '../../../scenes/GameScene';
import { Entity } from '../../Entity';
import StateMachine from '../../../utils/StateMachine';
import { EPossibleState } from '../../../constant/character';
import { RangedWeapon } from '../../../types/types';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class AttackState
 * @extends {State}
 */
export default class SecondaryAttackState extends State
{
    private stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        const weapon = scene.secondaryWeaponGroup.getFirstDead(false, character.body.x, character.body.y, undefined, undefined, true) as RangedWeapon;

        const ammo = character.status.ammo;

        if (!weapon || ammo === 0)
        {
            this.stateMachine.transition(EPossibleState.ATTACK, this.stateMachine.prevState);

            return;
        }

        character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        {
            weapon.attack();

            const value = ammo - 1;

            character.setStatusHeart(value);

            character.physicsProperties.isAttacking = false;

            this.stateMachine.transition(this.stateMachine.prevState, this.stateMachine.state);
        });

        character.anims.play(character.animList.SECONDARY_ATTACK!, true);

        character.body.setAcceleration(0).setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff, 0);

        console.log('SECONDARY ATTACK STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {

    }
}