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
 * @class AttackState
 * @extends {State}
 */
export default class AttackState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity  )
    {
        log(character.name + ' ATTACK STATE');

        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        {
            character.meleeWeapon?.body.setEnable(false);

            character.physicsProperties.isAttacking = false;

            if(character.physicsProperties.isHurt)
            {
                this.stateMachine.transition(EStates.IDLE, this.stateMachine.state);

                return;
            }

            this.stateMachine.transition(this.stateMachine.prevState, this.stateMachine.state);

            return;
        });

        character.anims.play(character.animList.ATTACK!, true);

        character.body.setAcceleration(0).setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff, 0);
    }

    public execute(scene: GameScene, character: Entity)
    {
        
    }
}