import { EPossibleState } from "../../../constant/character";
import GameScene from "../../../scenes/GameScene";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class JumpState
 * @extends {State}
 */
export default class JumpMomentumState extends State
{
    private stateMachine: StateMachine;
    private momentTime: number = 0;

    public enter (scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        this.momentTime = now;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.anims.play(character.animList.JUMP!, true);

        character.body.setGravityY(character.physicsProperties.gravity / 2).setDragY(character.physicsProperties.acceleration * 16).setAccelerationY(100);

        console.log('MOMENTUM STATE');
    }

    public execute (scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b,  start, select } = character.buttons;

        const { blocked } = character.body;

        const { isAttacking, isHurt } = character.physicsProperties;

        const { now } = scene.time;

        // Player is hit by enemy
        if (character.canUse(EPossibleState.HURT) && character.physicsProperties.isHurt)
        {
            this.stateMachine.transition(EPossibleState.HURT, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.JUMP_MOMENTUM_ATTACK) && a.isDown && a.getDuration(now) < 128 && !isAttacking)
        {
            this.stateMachine.transition(EPossibleState.JUMP_MOMENTUM_ATTACK, this.stateMachine.state, this.momentTime);

            return;
        }

        if (this.momentTime + 250 < now)
        {
            character.body.setGravityY(character.physicsProperties.gravity);

            if (!isHurt)
            {
                this.stateMachine.transition(EPossibleState.FALL, this.stateMachine.state);

                return;
            }
        }

        // If touching the ceiling
        if (blocked.up)
        {
            this.stateMachine.transition(EPossibleState.FALL, this.stateMachine.state);

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
