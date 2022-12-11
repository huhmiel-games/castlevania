import { EPossibleState } from "../../../constant/character";
import { PLAYER_A_NAME, TILE_SIZE } from "../../../constant/config";
import { TILES } from "../../../constant/tiles";
import GameScene from "../../../scenes/GameScene";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Enemy } from "../../enemies/Enemy";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2021
 * @export
 * @class SideState
 * @extends {State}
 */
export default class SideState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Enemy)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.anims.play(character.animList.IDLE!, true);

        character.body.setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff, 0)
            .setAcceleration(0, 0)
            .setAllowGravity(false);

        const player = scene.getPlayerByName(PLAYER_A_NAME);

        if (character.canUse(EPossibleState.LEFT) && player.damageBody.x < character.body.x)
        {
            this.stateMachine.transition(EPossibleState.LEFT, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.RIGHT) && player.damageBody.x > character.body.x)
        {
            this.stateMachine.transition(EPossibleState.RIGHT, this.stateMachine.state);

            return;
        }

        console.log(character.name + ' SIDE STATE');
    }

    public execute(scene: GameScene, character: Enemy)
    {
        const { left, right, up, down, a, b, y, start, select } = character.buttons;

        const { blocked, touching } = character.body;

        const { now } = scene.time;



        if (character.canUse(EPossibleState.PROXIMITY) && y.isDown)
        {
            this.stateMachine.transition(EPossibleState.PROXIMITY, this.stateMachine.state);

            return;
        }

        // if (character.canUse(EPossibleState.LEFT) && distance < character.ai[character.currentStateIndex].condition.distance)
        // {
        //     this.stateMachine.transition(EPossibleState.LEFT, this.stateMachine.state);

        //     return;
        // }

        // if (character.canUse(EPossibleState.RIGHT) && distance < character.ai[character.currentStateIndex].condition.distance)
        // {
        //     this.stateMachine.transition(EPossibleState.RIGHT, this.stateMachine.state);

        //     return;
        // }

        // if (character.canUse(EPossibleState.JUMP)
        //     && b.isDown
        //     && now - b.timeUp > 250
        //     && b.getDuration(now) > 75
        //     && b.getDuration(now) < 150
        // )
        // {
        //     this.stateMachine.transition(EPossibleState.JUMP, this.stateMachine.state);

        //     return;
        // }

        // if (character.canUse(EPossibleState.UPSTAIR_RIGHT) && up.isDown)
        // {
        //     const { right, bottom } = character.body;

        //     const tile = scene.colliderLayer.getTileAtWorldXY(right - 1, bottom - 1);

        //     if (tile?.properties?.hasOwnProperty(TILES.STAIR_RIGHT))
        //     {
        //         character.body.reset(tile.pixelX, tile.pixelY);
        //         character.anims.pause();

        //         this.stateMachine.transition(EPossibleState.UPSTAIR_RIGHT, this.stateMachine.state);

        //         return;
        //     }
        // }

        // if (character.canUse(EPossibleState.DOWNSTAIR_RIGHT) && down.isDown)
        // {
        //     const { right, bottom } = character.body;

        //     const tile = scene.colliderLayer.getTileAtWorldXY(right, bottom + TILE_SIZE / 4);

        //     if (tile?.properties?.hasOwnProperty(TILES.STAIR_LEFT))
        //     {
        //         character.body.reset(tile.pixelX + TILE_SIZE / 2, tile.pixelY - TILE_SIZE / 2);

        //         character.anims.pause();

        //         this.stateMachine.transition(EPossibleState.DOWNSTAIR_RIGHT, this.stateMachine.state)

        //         return;
        //     }
        // }

        // if (character.canUse(EPossibleState.UPSTAIR_LEFT) && up.isDown)
        // {
        //     const { left, bottom } = character.body;

        //     const tile = scene.colliderLayer.getTileAtWorldXY(left + 1, bottom - 1);

        //     if (tile?.properties?.hasOwnProperty(TILES.STAIR_LEFT))
        //     {
        //         character.body.reset(tile.pixelX + TILE_SIZE, tile.pixelY);

        //         character.anims.pause();

        //         this.stateMachine.transition(EPossibleState.UPSTAIR_LEFT, this.stateMachine.state);

        //         return;
        //     }
        // }

        // if (character.canUse(EPossibleState.DOWNSTAIR_LEFT) && down.isDown)
        // {
        //     const { left, bottom } = character.body;

        //     const tile = scene.colliderLayer.getTileAtWorldXY(left, bottom + TILE_SIZE / 4);

        //     if (tile?.properties?.hasOwnProperty(TILES.STAIR_RIGHT))
        //     {
        //         character.body.reset(tile.pixelX + TILE_SIZE / 2, tile.pixelY - TILE_SIZE / 2);

        //         character.anims.pause();

        //         this.stateMachine.transition(EPossibleState.DOWNSTAIR_LEFT, this.stateMachine.state)

        //         return;
        //     }
        // }

        // if (character.canUse(EPossibleState.CROUCH) && down.isDown && !character.physicsProperties.isAttacking)
        // {
        //     this.stateMachine.transition(EPossibleState.CROUCH, this.stateMachine.state);

        //     return;
        // }

        // if (character.canUse(EPossibleState.FALL) && !blocked.down)
        // {
        //     this.stateMachine.transition(EPossibleState.FALL, this.stateMachine.state);

        //     return;
        // }
    }
}