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
 * @class StairSecondaryAttackState
 * @extends {State}
 */
export default class StairSecondaryAttackState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity, direction?: string)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        const weapon = scene.secondaryWeaponGroup.getFirstDead(false, character.body.x, character.body.y, undefined, undefined, true) as RangedWeapon;

        const ammo = character.status.ammo;

        if (!weapon || ammo === 0)
        {
            this.stateMachine.transition(EPossibleState.STAIR_ATTACK, this.stateMachine.prevState, direction);

            return;
        }

        character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        {
            weapon.attack();

            const value = ammo - 1;

            character.setStatusAmmo(value);

            character.physicsProperties.isAttacking = false;

            character.setFrame(currentFrameName);

            this.stateMachine.transition(this.stateMachine.prevState, this.stateMachine.state);
        });

        const currentFrameName = character.frame.name;

        if (direction === 'up')
        {
            character.anims.play(character.animList.UPSTAIR_SECONDARY_ATTACK!, true);
        }
        else
        {
            character.anims.play(character.animList.DOWNSTAIR_SECONDARY_ATTACK!, true);
        }

        console.log(character.name + ' STAIR SECONDARY ATTACK STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {

    }
}