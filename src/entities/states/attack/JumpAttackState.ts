import { EPossibleState } from "../../../constant/character";
import GameScene from "../../../scenes/GameScene";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Entity } from "../../Entity";


/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class JumpAttackState
 * @extends {State}
 */
export default class JumpAttackState extends State
{
    public stateMachine: StateMachine;
    private groundYPosition: number;

    public enter(scene: GameScene, character: Entity, groundYPosition?: number)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        this.groundYPosition = groundYPosition || now;

        character.body.setDrag(0).setMaxVelocityY(character.physicsProperties.speed * 4).setVelocityY(-300);

        character.anims.play(character.animList.JUMP_ATTACK!, true);

        character.physicsProperties.isAttacking = true;

        console.log('JUMP ATTACK STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b,  start, select } = character.buttons;

        const { blocked, bottom } = character.body;

        const { now } = scene.time;

        // End of jump
        if (this.groundYPosition - 32 > bottom || b.isUp)
        {
            this.stateMachine.transition(EPossibleState.JUMP_MOMENTUM_ATTACK, this.stateMachine.state);

            return;
        }

        // If touching the ceiling
        if (blocked.up)
        {
            this.stateMachine.transition(EPossibleState.FALL_ATTACK, this.stateMachine.state);

            return;
        }

        // Player is hit by enemy
        if (character.physicsProperties.isHurt)
        {
            this.stateMachine.transition(EPossibleState.HURT, this.stateMachine.state);

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
