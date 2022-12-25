import State from '../../../utils/State'
import GameScene from '../../../scenes/GameScene';
import { Entity } from '../../Entity';
import StateMachine from '../../../utils/StateMachine';
import { EPossibleState } from '../../../constant/character';
import { RangedWeapon } from '../../../types/types';
import { Enemy } from '../../enemies/Enemy';

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
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        const weapon = character.secondaryWeaponGroup.getFirstDead(false, character.body.x, character.body.y, undefined, undefined, true) as RangedWeapon;

        const ammo = character.status.ammo;

        if (!weapon || ammo === 0)
        {
            if (character.canUse(EPossibleState.ATTACK))
            {
                this.stateMachine.transition(EPossibleState.ATTACK, this.stateMachine.prevState);
            }
            else
            {
                this.stateMachine.transition(this.stateMachine.prevState, this.stateMachine.state);
            }

            return;
        }

        weapon.parent = character;

        character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        {
            if (character.physicsProperties.isDead) return;

            weapon.setDepth(character.depth - 1);

            weapon.attack(character.config?.secondaryAttackOffsetY || 8);

            const value = ammo - 1;

            character.setStatusAmmo(value);

            character.physicsProperties.isAttacking = false;

            if (character instanceof Enemy)
            {
                scene.time.addEvent({
                    delay: 250,
                    callback: () =>
                    {
                        this.stateMachine.transition(this.stateMachine.initialState, this.stateMachine.state);

                        return;
                    }
                })
            }
            else
            {
                this.stateMachine.transition(this.stateMachine.prevState, this.stateMachine.state);
            }


        });

        character.anims.play(character.animList.SECONDARY_ATTACK!, true);

        character.body.setAcceleration(0).setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff, 0);

        console.log(character.name + ' SECONDARY ATTACK STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {

    }
}