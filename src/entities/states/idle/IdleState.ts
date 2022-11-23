import { EPossibleState } from "../../../constant/character";
import { TILE_SIZE } from "../../../constant/config";
import { TILES } from "../../../constant/tiles";
import GameScene from "../../../scenes/GameScene";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2021
 * @export
 * @class IdleState
 * @extends {State}
 */
export default class IdleState extends State
{
    private stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.anims.play(character.animList.IDLE!, true);

        character.body.setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff, 0)
            .setAcceleration(0, 0);

        console.log('IDLE STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b, start, select } = character.buttons;

        const { blocked, touching } = character.body;

        const { now } = scene.time;

        if (character.canUse(EPossibleState.ATTACK) && a.isDown && up.isUp && a.getDuration(now) < 128 && !character.physicsProperties.isAttacking)
        {
            this.stateMachine.transition(EPossibleState.ATTACK, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.SECONDARY_ATTACK) && a.isDown && up.isDown && a.getDuration(now) < 128 && !character.physicsProperties.isAttacking)
        {
            this.stateMachine.transition(EPossibleState.SECONDARY_ATTACK, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.LEFT) && left.isDown && right.isUp && !character.physicsProperties.isAttacking)
        {
            this.stateMachine.transition(EPossibleState.LEFT, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.RIGHT) && right.isDown && left.isUp && !character.physicsProperties.isAttacking)
        {
            this.stateMachine.transition(EPossibleState.RIGHT, this.stateMachine.state);

            return;
        }

        // old backflip jump, keeped as comment just in case
        // if (character.canUse(EPossibleState.BACK_FLIP)
        //     && this.stateMachine.prevState !== EPossibleState.FALL
        //     && this.stateMachine.prevState !== EPossibleState.FALL_ATTACK
        //     && this.stateMachine.prevState !== EPossibleState.FALL_SECONDARY_ATTACK
        //     && b.isDown
        //     && b.timeDown !== 0
        //     && now - b.timeUp < 250
        //     && b.getDuration(now) < 50
        // )
        // {
        //     this.stateMachine.transition(EPossibleState.BACK_FLIP, this.stateMachine.state);

        //     return;
        // }

        if (character.canUse(EPossibleState.JUMP)
            && b.isDown
            && now - b.timeUp > 250
            && b.getDuration(now) > 75
            && b.getDuration(now) < 150
        )
        {
            this.stateMachine.transition(EPossibleState.JUMP, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.UPSTAIR_RIGHT) && up.isDown)
        {
            const { right, bottom } = character.body;

            const tile = scene.colliderLayer.getTileAtWorldXY(right - 1, bottom - 1);

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_RIGHT))
            {
                character.body.reset(tile.pixelX, tile.pixelY);
                character.anims.pause();

                this.stateMachine.transition(EPossibleState.UPSTAIR_RIGHT, this.stateMachine.state);

                return;
            }
        }

        if (character.canUse(EPossibleState.DOWNSTAIR_RIGHT) && down.isDown)
        {
            const { center, bottom } = character.body;

            const tile = scene.colliderLayer.getTileAtWorldXY(center.x, bottom + TILE_SIZE / 4);

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_LEFT))
            {
                character.body.reset(tile.pixelX + TILE_SIZE / 2, tile.pixelY - TILE_SIZE / 2);

                character.anims.pause();

                this.stateMachine.transition(EPossibleState.DOWNSTAIR_RIGHT, this.stateMachine.state)

                return;
            }
        }

        if (character.canUse(EPossibleState.UPSTAIR_LEFT) && up.isDown)
        {
            const { left, bottom } = character.body;

            const tile = scene.colliderLayer.getTileAtWorldXY(left, bottom - 1);

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_LEFT))
            {
                character.body.reset(tile.pixelX + TILE_SIZE, tile.pixelY);

                character.anims.pause();

                this.stateMachine.transition(EPossibleState.UPSTAIR_LEFT, this.stateMachine.state);

                return;
            }
        }

        if (character.canUse(EPossibleState.DOWNSTAIR_LEFT) && down.isDown)
        {
            const { center, bottom } = character.body;

            const tile = scene.colliderLayer.getTileAtWorldXY(center.x, bottom + TILE_SIZE / 4);

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_RIGHT))
            {
                character.body.reset(tile.pixelX + TILE_SIZE / 2, tile.pixelY - TILE_SIZE / 2);

                character.anims.pause();

                this.stateMachine.transition(EPossibleState.DOWNSTAIR_LEFT, this.stateMachine.state)

                return;
            }
        }

        if (character.canUse(EPossibleState.CROUCH) && down.isDown && !character.physicsProperties.isAttacking)
        {
            this.stateMachine.transition(EPossibleState.CROUCH, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.FALL) && !blocked.down)
        {
            this.stateMachine.transition(EPossibleState.FALL, this.stateMachine.state);

            return;
        }
    }
}