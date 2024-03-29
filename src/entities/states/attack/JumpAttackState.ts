import { EStates } from "../../../constant/character";
import GameScene from "../../../scenes/GameScene";
import { log } from "../../../utils/log";
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
        log(character.name + ' JUMP ATTACK STATE');

        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        this.groundYPosition = groundYPosition || character.body.bottom;

        character.body.setDrag(0).setMaxVelocityY(character.physicsProperties.speed * 4);

        character.anims.play(character.animList.JUMP_ATTACK!, true);

        character.physicsProperties.isAttacking = true;
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, b } = character.buttons;

        const { blocked, bottom } = character.body;

        // End of jump
        if (this.groundYPosition - 32 > bottom || b.isUp)
        {
            this.stateMachine.transition(EStates.JUMP_MOMENTUM_ATTACK, this.stateMachine.state);

            return;
        }

        // If touching the ceiling
        if (blocked.up)
        {
            this.stateMachine.transition(EStates.FALL_ATTACK, this.stateMachine.state);

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
