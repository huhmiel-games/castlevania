import { EStates } from "../../../constant/character";
import { TILE_SIZE } from "../../../constant/config";
import { TILES } from "../../../constant/tiles";
import GameScene from "../../../scenes/GameScene";
import { log } from "../../../utils/log";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class WalkRightState
 * @extends {State}
 */
export default class WalkRightState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.setFlipX(false).anims.play(character.animList.RIGHT!, true);

        character.body.setDrag(0, 0).setAcceleration(character.physicsProperties.acceleration, 0);

        log(character.name + ' RIGHT STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b, y } = character.buttons;

        const { isAttacking } = character.physicsProperties;

        const { blocked } = character.body;

        const { now } = scene.time;

        if (character.canUse(EStates.ATTACK) && a.isDown && up.isUp && a.getDuration(now) < 128)
        {
            this.stateMachine.transition(EStates.ATTACK, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.SECONDARY_ATTACK) && a.isDown && up.isDown && a.getDuration(now) < 128 && !isAttacking)
        {
            this.stateMachine.transition(EStates.SECONDARY_ATTACK, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.IDLE) && right.isUp)
        {
            this.stateMachine.transition(EStates.IDLE, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.JUMP) && b.isDown && b.getDuration(now) < 150)
        {
            this.stateMachine.transition(EStates.JUMP, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.FALL) && !blocked.down)
        {
            this.stateMachine.transition(EStates.FALL, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.RECOIL_RIGHT) && right.isDown && y.isDown && left.isUp && !isAttacking)
        {
            this.stateMachine.transition(EStates.RECOIL_RIGHT, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.UPSTAIR_RIGHT) && up.isDown)
        {
            const { right, bottom } = character.body;

            const tile = scene.colliderLayer.getTileAtWorldXY(right - 1, bottom - 1);

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_RIGHT))
            {
                character.body.reset(tile.pixelX, tile.pixelY);
                character.anims.pause();

                this.stateMachine.transition(EStates.UPSTAIR_RIGHT, this.stateMachine.state);

                return;
            }
        }

        if (character.canUse(EStates.DOWNSTAIR_RIGHT) && down.isDown)
        {
            const { center, bottom } = character.body;

            const tile = scene.colliderLayer.getTileAtWorldXY(center.x, bottom + TILE_SIZE / 4);

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_LEFT))
            {
                character.body.reset(tile.pixelX + TILE_SIZE / 2, tile.pixelY - TILE_SIZE / 2);

                character.anims.pause();

                this.stateMachine.transition(EStates.DOWNSTAIR_RIGHT, this.stateMachine.state)

                return;
            }
        }
    }
}