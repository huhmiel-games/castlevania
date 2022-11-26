import { EPossibleState } from "../../../constant/character";
import { TILE_SIZE } from "../../../constant/config";
import { TILES } from "../../../constant/tiles";
import GameScene from "../../../scenes/GameScene";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class FallState
 * @extends {State}
 */
export default class FallState extends State
{
    public stateMachine: StateMachine;
    private jumpTime: number = 0;
    public enter(scene: GameScene, character: Entity, jumpTime?: number)
    {
        const { now } = scene.time;

        this.jumpTime = jumpTime || now;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.anims.play(character.animList.FALL!, true);

        character.body.setGravityY(character.physicsProperties.gravity).setDrag(0).setMaxVelocityY(character.physicsProperties.speed * 4);

        console.log('FALL STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b,  start, select } = character.buttons;

        const { body, flipX } = character;

        const { isAttacking, acceleration, speed } = character.physicsProperties;

        const { now } = scene.time;

        if (character.canUse(EPossibleState.FALL_ATTACK) && a.isDown && a.getDuration(now) < 128 && !isAttacking)
        {
            this.stateMachine.transition(EPossibleState.FALL_ATTACK, this.stateMachine.state, this.jumpTime);

            return;
        }

        // Transition to Idle if touching ground
        if (body.blocked.down)
        {
            character.y = Math.round(character.y); // fix a bug where the character is 1 pixel off from ground
            
            body.setMaxVelocityY(speed * 2);

            this.stateMachine.transition(EPossibleState.IDLE, this.stateMachine.state);

            return;
        }

        // ghost jumping
        if ((this.stateMachine.prevState === EPossibleState.LEFT || this.stateMachine.prevState === EPossibleState.RIGHT)
            && this.jumpTime + 75 > now
            && b.isDown
        )
        {
            character.body.setMaxVelocityY(speed * 4);

            this.stateMachine.transition(EPossibleState.JUMP, this.stateMachine.state);

            return;
        }

        if (flipX && character.canUse(EPossibleState.UPSTAIR_LEFT) && up.isDown)
        {
            const { left, bottom } = body;

            const tile = scene.colliderLayer.getTileAtWorldXY(left, bottom);

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_RIGHT))
            {
                body.reset(tile.pixelX, tile.pixelY);
                character.anims.pause();

                this.stateMachine.transition(EPossibleState.DOWNSTAIR_LEFT, this.stateMachine.state);

                return;
            }

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_LEFT))
            {
                body.reset(tile.pixelX + TILE_SIZE, tile.pixelY);
                character.anims.pause();

                this.stateMachine.transition(EPossibleState.UPSTAIR_LEFT, this.stateMachine.state);

                return;
            }
        }

        if (!character.flipX && character.canUse(EPossibleState.UPSTAIR_RIGHT) && up.isDown)
        {
            const { right, bottom } = body;

            const tile = scene.colliderLayer.getTileAtWorldXY(right - 1, bottom);

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_LEFT))
            {
                body.reset(tile.pixelX + TILE_SIZE / 2, tile.pixelY - 8);
                character.anims.pause();

                this.stateMachine.transition(EPossibleState.DOWNSTAIR_RIGHT, this.stateMachine.state);

                return;
            }

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_RIGHT))
            {
                body.reset(tile.pixelX, tile.pixelY);
                character.anims.pause();

                this.stateMachine.transition(EPossibleState.UPSTAIR_RIGHT, this.stateMachine.state);

                return;
            }
        }

        // if(body.top + 32 > scene.cameras.main.getBounds().bottom + 32)
        // {
        //     character.die();

        //     return;
        // }

        if (left.isDown && right.isUp)
        {
            body.setAcceleration(-acceleration * 5, acceleration * 5);

            return;
        }

        if (right.isDown && left.isUp)
        {
            body.setAcceleration(acceleration * 5, acceleration * 5);

            return;
        }

        body.setAccelerationY(acceleration * 5);
    }
}