import { EStates } from "../../../constant/character";
import { TILE_SIZE } from "../../../constant/config";
import { DEPTH } from "../../../constant/depth";
import GameScene from "../../../scenes/GameScene";
import { log } from "../../../utils/log";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class BackFlipState
 * @extends {State}
 */
export default class BackFlipState extends State
{
    public stateMachine: StateMachine;
    private groundYPosition: number;
    /**
     * 0: start backflip
     * 1: end jump
     * 2: sliding to ground
     */
    private startBackFlip: number;

    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        // Initialize the jump
        this.groundYPosition = character.body.bottom;

        this.startBackFlip = 0;

        character.body.setDrag(0).setMaxVelocityY(character.physicsProperties.speed * 4);

        // Handle animations
        character.anims.play(character.animList.BACK_FLIP!, true);

        log(character.name + ' BACK FLIP STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { a, up } = character.buttons;

        const { flipX } = character;

        const { blocked, bottom } = character.body;

        const { isAttacking } = character.physicsProperties;

        const { now } = scene.time;

        if (character.canUse(EStates.JUMP_MOMENTUM_SECONDARY_ATTACK)
            && up.isDown
            && a.isDown
            && a.getDuration(now) < 128
            && !isAttacking
            && character.secondaryWeaponGroup.countActive(false) > 0
            && character.status.ammo > 0
        )
        {
            this.stateMachine.transition(EStates.JUMP_MOMENTUM_SECONDARY_ATTACK, this.stateMachine.state, this.groundYPosition);

            return;
        }

        if (character.canUse(EStates.JUMP_MOMENTUM_ATTACK) && a.isDown && a.getDuration(now) < 128 && !isAttacking)
        {
            this.stateMachine.transition(EStates.JUMP_MOMENTUM_ATTACK, this.stateMachine.state, this.groundYPosition);

            return;
        }

        // End of jump
        if (this.groundYPosition - (TILE_SIZE + TILE_SIZE / 4) > bottom && this.startBackFlip === 0)
        {
            character.body.setAccelerationY(0);

            this.startBackFlip = 1;
        }

        if (this.startBackFlip === 0)
        {
            character.body.setAccelerationY(-character.physicsProperties.acceleration * 15);
        }

        if (this.startBackFlip === 1 && blocked.down)
        {
            this.startBackFlip = 2;

            character.anims.play(character.animList.CROUCH!, true);

            const { x, y } = character.body.center;

            const puff = scene.puffGroup?.get(x, y);

            if (puff)
            {
                puff.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => puff.setActive(false).setVisible(false));
                puff.setDepth(DEPTH.FRONT_LAYER).setActive(true).setVisible(true).play('puff');
            }

            scene.time.addEvent({
                delay: 200,
                callback: () => this.stateMachine.transition(EStates.CROUCH, this.stateMachine.state)
            });
        }

        // If touching the ceiling
        if (blocked.up)
        {
            this.stateMachine.transition(EStates.FALL, this.stateMachine.state);

            return;
        }

        if (flipX)
        {
            character.body.setAccelerationX(character.physicsProperties.acceleration * 5);
        }

        if (!flipX)
        {
            character.body.setAccelerationX(-character.physicsProperties.acceleration * 5);
        }
    }
}
