import { EPossibleState } from "../../../constant/character";
import GameScene from "../../../scenes/GameScene";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class FallAttackState
 * @extends {State}
 */
export default class FallAttackState extends State
{
    public stateMachine: StateMachine;
    private jumpTime: number = 0;
    public enter(scene: GameScene, character: Entity, jumpTime?: number)
    {
        const { now } = scene.time;

        this.jumpTime = jumpTime || now;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.body.setGravityY(character.physicsProperties.gravity).setDrag(0).setMaxVelocityY(character.physicsProperties.acceleration * 3);

        character.anims.play(character.animList.JUMP_ATTACK!, true);

        character.physicsProperties.isAttacking = true;

        console.log(character.name + ' FALL ATTACK STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b,  start, select } = character.buttons;

        const { body } = character;

        const { now } = scene.time;

        const { isAttacking, acceleration, speed } = character.physicsProperties;

        // Transition to Idle if touching ground
        if (character.canUse(EPossibleState.IDLE) && body.blocked.down && !isAttacking)
        {
            character.body.setMaxVelocityY(speed * 2);

            this.stateMachine.transition(EPossibleState.IDLE, this.stateMachine.state);

            return;
        }

        if (!body.blocked.down && !isAttacking)
        {
            this.stateMachine.transition(EPossibleState.FALL, this.stateMachine.state, this.jumpTime);

            return;
        }

        // ghost jumping
        if ((this.stateMachine.prevState === EPossibleState.LEFT || this.stateMachine.prevState === EPossibleState.RIGHT)
            && this.jumpTime + 75 > now
            && b.isDown
        )
        {
            character.body.setMaxVelocityY(speed * 2);

            this.stateMachine.transition(EPossibleState.JUMP, this.stateMachine.state);

            return;
        }

        if (left.isDown && right.isUp)
        {
            character.body.setAcceleration(-acceleration * 5, acceleration * 5);

            return;
        }

        if (right.isDown && left.isUp)
        {
            character.body.setAcceleration(acceleration * 5, acceleration * 5);

            return;
        }

        character.body.setAccelerationY(acceleration * 5);
    }
}