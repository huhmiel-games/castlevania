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
 * @class WalkLeftState
 * @extends {State}
 */
export default class WalkLeftState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.setFlipX(true).anims.play(character.animList.LEFT!, true);

        character.body.setDrag(0, 0).setAcceleration(-character.physicsProperties.acceleration, 0);

        console.log(character.name + ' LEFT STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b,  start, select } = character.buttons;

        const { isAttacking } = character.physicsProperties;

        const { blocked, touching } = character.body;

        const { now } = scene.time;

        if (character.canUse(EPossibleState.ATTACK) && a.isDown && up.isUp && a.getDuration(now) < 128)
        {
            this.stateMachine.transition(EPossibleState.ATTACK, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.SECONDARY_ATTACK) && a.isDown && up.isDown && a.getDuration(now) < 128 && !isAttacking)
        {
            this.stateMachine.transition(EPossibleState.SECONDARY_ATTACK, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.IDLE) && left.isUp)
        {
            this.stateMachine.transition(EPossibleState.IDLE, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.JUMP) && b.isDown && b.getDuration(now) < 150)
        {
            this.stateMachine.transition(EPossibleState.JUMP, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.FALL) && !blocked.down)
        {
            this.stateMachine.transition(EPossibleState.FALL, this.stateMachine.state);

            return;
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
    }
}