import { EPossibleState, JUMP_MOMENTUM_DELAY } from "../../../constant/character";
import GameScene from "../../../scenes/GameScene";
import { log } from "../../../utils/log";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class JumpMomentumAttackState
 * @extends {State}
 */
export default class JumpMomentumAttackState extends State
{
    public stateMachine: StateMachine;
    private momentTime: number = 0;

    public enter(scene: GameScene, character: Entity, jumpTime?: number)
    {
        log(character.name + ' MOMENTUM ATTACK STATE');

        const { now } = scene.time;

        this.momentTime = jumpTime || now;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.body.setGravityY(character.physicsProperties.gravity / 2)
            .setDragY(character.physicsProperties.acceleration * 16)
            .setAccelerationY(100);

        character.anims.play(character.animList.JUMP_ATTACK!, true);

        character.physicsProperties.isAttacking = true;
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right } = character.buttons;

        const { blocked } = character.body;

        const { isAttacking } = character.physicsProperties;

        const { now } = scene.time;

        if (this.momentTime + JUMP_MOMENTUM_DELAY < now)
        {
            character.body.setGravityY(character.physicsProperties.gravity);

            if (!isAttacking)
            {
                this.stateMachine.transition(EPossibleState.FALL, this.stateMachine.state);

                return;
            }

            if (isAttacking)
            {
                this.stateMachine.transition(EPossibleState.FALL_ATTACK, this.stateMachine.state);

                return;
            }
        }

        // If touching the ceiling
        if (blocked.up)
        {
            this.stateMachine.transition(EPossibleState.FALL_ATTACK, this.stateMachine.state);

            return;
        }

        if (left.isDown && right.isUp)
        {
            character.body.setAcceleration(-character.physicsProperties.acceleration * 5, 0);

            return;
        }

        if (right.isDown && left.isUp)
        {
            character.body.setAcceleration(character.physicsProperties.acceleration * 5, 0);

            return;
        }

        character.body.setAccelerationY(0);

    }
}
