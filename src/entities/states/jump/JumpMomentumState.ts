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
 * @class JumpState
 * @extends {State}
 */
export default class JumpMomentumState extends State
{
    public stateMachine: StateMachine;
    private momentTime: number = 0;

    public enter(scene: GameScene, character: Entity)
    {
        log(character.name + ' MOMENTUM STATE');

        const { now } = scene.time;

        this.momentTime = now;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.anims.play(character.animList.JUMP!, true);

        character.body.setGravityY(character.physicsProperties.gravity / 2)
            .setDragY(character.physicsProperties.acceleration * 16)
            .setAccelerationY(100);
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, up, a } = character.buttons;

        const { blocked } = character.body;

        const { isAttacking } = character.physicsProperties;

        const { now } = scene.time;

        if (character.canUse(EPossibleState.JUMP_MOMENTUM_SECONDARY_ATTACK)
            && up.isDown
            && a.isDown
            && a.getDuration(now) < 128 && !isAttacking
            && character.secondaryWeaponGroup.countActive(false) > 0
            && character.status.ammo > 0
        )
        {
            this.stateMachine.transition(EPossibleState.JUMP_MOMENTUM_SECONDARY_ATTACK, this.stateMachine.state, this.momentTime);

            return;
        }

        if (character.canUse(EPossibleState.JUMP_MOMENTUM_ATTACK) && a.isDown && a.getDuration(now) < 128 && !isAttacking)
        {
            this.stateMachine.transition(EPossibleState.JUMP_MOMENTUM_ATTACK, this.stateMachine.state, this.momentTime);

            return;
        }

        if (this.momentTime + JUMP_MOMENTUM_DELAY < now)
        {
            character.body.setGravityY(character.physicsProperties.gravity);

            this.stateMachine.transition(EPossibleState.FALL, this.stateMachine.state);

            return;
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

            character.setFlipX(true);

            return;
        }

        if (right.isDown && left.isUp)
        {
            character.body.setAcceleration(character.physicsProperties.acceleration * 5, 0);

            character.setFlipX(false);

            return;
        }

        character.body.setAccelerationY(0);
    }
}
