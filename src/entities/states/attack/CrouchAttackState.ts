import State from '../../../utils/State'
import GameScene from '../../../scenes/GameScene';
import { Entity } from '../../Entity';
import StateMachine from '../../../utils/StateMachine';
import { EPossibleState } from '../../../constant/character';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class CrouchAttackState
 * @extends {State}
 */
export default class CrouchAttackState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        {
            character.meleeWeapon?.body.setEnable(false);

            character.physicsProperties.isAttacking = false;

            this.stateMachine.transition(EPossibleState.CROUCH, this.stateMachine.state);
        });

        character.anims.play(character.animList.CROUCH_ATTACK!, true);

        character.body.setAcceleration(0).setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff, 0);

        console.log('ATTACK STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        
    }
}