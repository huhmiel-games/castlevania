import { EStates } from "../../../constant/character";
import { TILE_SIZE } from "../../../constant/config";
import GameScene from "../../../scenes/GameScene";
import { log } from "../../../utils/log";
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

    public enter(scene: GameScene, character: Entity)
    {
        log(character.name + ' JUMP STATE');

        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        // Initialize the jump
        this.groundYPosition = character.body.bottom;

        character.body.setDrag(0)
            .setMaxVelocityY(character.physicsProperties.maxSpeedY || character.physicsProperties.speed * 4);

        // Handle animations
        character.anims.play(character.animList.JUMP!, true);
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, up, a, b } = character.buttons;

        const { blocked, bottom } = character.body;

        const { isAttacking, jumpHeight } = character.physicsProperties;

        const { now } = scene.time;

        if (character.canUse(EStates.JUMP_SECONDARY_ATTACK)
            && up.isDown
            && a.isDown
            && a.getDuration(now) < 128
            && !isAttacking
            && character.secondaryWeaponGroup.countActive(false) > 0
            && character.status.ammo > 0
        )
        {
            this.stateMachine.transition(EStates.JUMP_SECONDARY_ATTACK, this.stateMachine.state, this.groundYPosition);

            return;
        }

        if (character.canUse(EStates.JUMP_ATTACK) && a.isDown && a.getDuration(now) < 128 && !isAttacking)
        {
            this.stateMachine.transition(EStates.JUMP_ATTACK, this.stateMachine.state, this.groundYPosition);

            return;
        }

        // End of jump
        if (this.groundYPosition - (jumpHeight ? TILE_SIZE * jumpHeight : 32) > bottom || b.isUp)
        {
            this.stateMachine.transition(EStates.JUMP_MOMENTUM, this.stateMachine.state);

            return;
        }

        // If touching the ceiling
        if (blocked.up)
        {
            this.stateMachine.transition(EStates.FALL, this.stateMachine.state);

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
