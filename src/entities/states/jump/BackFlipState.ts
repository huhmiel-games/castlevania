import { EPossibleState } from "../../../constant/character";
import GameScene from "../../../scenes/GameScene";
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

        const { left, right, up, down, a, b, start, select } = character.buttons;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        // Initialize the jump
        this.groundYPosition = character.body.bottom;

        this.startBackFlip = 0;

        character.body.setDrag(0).setMaxVelocityY(character.physicsProperties.speed * 4);

        // Handle animations
        character.anims.play(character.animList.BACK_FLIP!, true);

        console.log(character.name + ' BACK FLIP STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b, start, select } = character.buttons;

        const { flipX } = character;

        const { blocked, bottom, top } = character.body;

        const { isAttacking } = character.physicsProperties;

        const { now } = scene.time;

        if (character.canUse(EPossibleState.JUMP_ATTACK) && a.isDown && a.getDuration(now) < 128 && !isAttacking)
        {
            this.stateMachine.transition(EPossibleState.JUMP_ATTACK, this.stateMachine.state, this.groundYPosition);

            return;
        }

        // End of jump
        if (this.groundYPosition - 32 > bottom && this.startBackFlip === 0)
        {
            character.body.setAccelerationY(0);

            this.startBackFlip = 1;
        }
        
        if(this.startBackFlip === 0)
        {
            character.body.setAccelerationY(-character.physicsProperties.acceleration * 15);
        }
        
        if(this.startBackFlip === 1 && blocked.down)
        {
            this.startBackFlip = 2;

            character.anims.play(character.animList.CROUCH!, true);

            scene.time.addEvent({
                delay: 200,
                callback: () => this.stateMachine.transition(EPossibleState.CROUCH, this.stateMachine.state)
            });
        }

        // If touching the ceiling
        if (blocked.up)
        {
            this.stateMachine.transition(EPossibleState.FALL, this.stateMachine.state);

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
