import { EPossibleState } from "../../../constant/character";
import GameScene from "../../../scenes/GameScene";
import { RangedWeapon } from "../../../types/types";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Enemy } from "../../../custom/enemies/Enemy";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class FallSecondaryAttackState
 * @extends {State}
 */
export default class FallSecondaryAttackState extends State
{
    public stateMachine: StateMachine;
    private jumpTime: number = 0;
    public enter(scene: GameScene, character: Entity, jumpTime?: number)
    {
        console.log(character.name + ' FALL SECONDARY ATTACK STATE');

        const { now } = scene.time;

        this.jumpTime = jumpTime || now;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.secondaryAttack();

        if (this.stateMachine.prevState === EPossibleState.FALL)
        {
            character.secondaryAttack();
        }

        character.body.setGravityY(character.physicsProperties.gravity)
            .setDrag(0)
            .setMaxVelocityY(character.physicsProperties.speed * 4);

        character.anims.play(character.animList.JUMP_SECONDARY_ATTACK!, true);

        character.physicsProperties.isAttacking = true;
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, b } = character.buttons;

        const { body } = character;

        const { now } = scene.time;

        const { isAttacking, acceleration, speed } = character.physicsProperties;

        // Transition to Idle if touching ground
        if (character.canUse(EPossibleState.IDLE) && body.blocked.down)
        {
            character.physicsProperties.isAttacking = false;

            character.y = Math.round(character.y); // fix a bug where the character is 1 pixel off from ground

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