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
export default class JumpState extends State
{
    public stateMachine: StateMachine;
    private groundYPosition: number;

    public enter (scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        const { left, right, up, down, a, b,  start, select } = character.buttons;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        // Initialize the jump
        this.groundYPosition = character.body.bottom;

        character.body.setDrag(0).setMaxVelocityY(character.physicsProperties.speed * 4)//.setVelocityY(-300);

        // Handle animations
        character.anims.play(character.animList.JUMP!, true);

        console.log('JUMP STATE');
    }

    public execute (scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b,  start, select } = character.buttons;

        const { blocked, bottom } = character.body;

        const { isAttacking, isHurt } = character.physicsProperties;

        const { now } = scene.time;

        if (character.canUse(EPossibleState.JUMP_ATTACK) && a.isDown && a.getDuration(now) < 128 && !isAttacking)
        {
            this.stateMachine.transition(EPossibleState.JUMP_ATTACK, this.stateMachine.state, this.groundYPosition);

            return;
        }

        // End of jump
        if (this.groundYPosition - 32 > bottom || b.isUp)
        {
            this.stateMachine.transition(EPossibleState.JUMP_MOMENTUM, this.stateMachine.state);

            return;
        }

        // If touching the ceiling
        if (blocked.up)
        {
            this.stateMachine.transition(EPossibleState.FALL, this.stateMachine.state);

            return;
        }

        // Player is hit by enemy
        if (character.canUse(EPossibleState.HURT) && isHurt)
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
        
        if(b.isDown)
        {
            character.body.setAccelerationY(-character.physicsProperties.acceleration * 15);
        }
    }
}
