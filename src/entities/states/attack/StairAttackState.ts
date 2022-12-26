import State from '../../../utils/State'
import GameScene from '../../../scenes/GameScene';
import { Entity } from '../../Entity';
import StateMachine from '../../../utils/StateMachine';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class StairAttackState
 * @extends {State}
 */
export default class StairAttackState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity, direction?: string)
    {
        console.log(character.name + ' STAIR ATTACK STATE');

        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        {
            character.meleeWeapon?.body.setEnable(false);

            character.physicsProperties.isAttacking = false;

            character.setFrame(currentFrameName);

            this.stateMachine.transition(this.stateMachine.prevState, this.stateMachine.state);

            return;
        });

        const currentFrameName = character.frame.name;

        if (direction === 'up')
        {
            character.anims.play(character.animList.UPSTAIR_ATTACK!, true);
        }
        else
        {
            character.anims.play(character.animList.DOWNSTAIR_ATTACK!, true);
        }
    }

    public execute(scene: GameScene, character: Entity)
    {

    }
}