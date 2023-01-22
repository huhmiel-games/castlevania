import State from '../../../utils/State'
import GameScene from '../../../scenes/GameScene';
import { Entity } from '../../Entity';
import StateMachine from '../../../utils/StateMachine';
import { EPossibleState } from '../../../constant/character';
import { log } from '../../../utils/log';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class CrouchState
 * @extends {State}
 */
export default class CrouchState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.anims.play(character.animList.CROUCH!, true);

        character.body.setAcceleration(0)
            .setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff, 0);

        log(character.name + ' CROUCH STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, down, a, b } = character.buttons;

        const { now } = scene.time;

        if (a.isDown && a.getDuration(now) < 128 && !character.physicsProperties.isAttacking)
        {
            this.stateMachine.transition(EPossibleState.CROUCH_ATTACK, this.stateMachine.state);

            return;
        }

        if (left.isDown && right.isUp && !character.physicsProperties.isAttacking)
        {
            character.setFlipX(true);
        }

        if (right.isDown && left.isUp && !character.physicsProperties.isAttacking)
        {
            character.setFlipX(false);
        }

        if (character.canUse(EPossibleState.BACK_FLIP)
            && b.isDown
            && character.stateTimestamp.getTimestamp() + 200 > now 
            && b.getDuration(now) < 50
        )
        {
            this.stateMachine.transition(EPossibleState.BACK_FLIP, this.stateMachine.state);

            return;
        }

        if (b.isDown && b.getDuration(now) < 150)
        {
            this.stateMachine.transition(EPossibleState.JUMP, this.stateMachine.state);
        }

        if (down.isUp && !character.physicsProperties.isAttacking)
        {
            this.stateMachine.transition(EPossibleState.IDLE, this.stateMachine.state);
        }
    }
}