import { EPossibleState } from "../../../constant/character";
import { TILE_SIZE } from "../../../constant/config";
import { TILES } from "../../../constant/tiles";
import GameScene from "../../../scenes/GameScene";
import { log } from "../../../utils/log";
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
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.anims.play(character.animList.IDLE!, true);

        character.body.setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff, 0)
            .setAcceleration(0, 0);


        log(character.name + ' IDLE STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b, y } = character.buttons;

        const { blocked } = character.body;

        const { isAttacking } = character.physicsProperties;

        const { now } = scene.time;

        if (character.canUse(EPossibleState.SECONDARY_ATTACK)
            && a.isDown
            && up.isDown
            && a.getDuration(now) < 128 && !isAttacking
            && character.secondaryWeaponGroup.countActive(false) > 0
            && character.status.ammo > 0
        )
        {
            this.stateMachine.transition(EPossibleState.SECONDARY_ATTACK, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.ATTACK) && a.isDown && a.getDuration(now) < 128 && !isAttacking)
        {
            this.stateMachine.transition(EPossibleState.ATTACK, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.LEFT) && left.isDown && right.isUp && !isAttacking)
        {
            this.stateMachine.transition(EPossibleState.LEFT, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.RIGHT) && right.isDown && left.isUp && !isAttacking)
        {
            this.stateMachine.transition(EPossibleState.RIGHT, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.RECOIL_LEFT) && left.isDown && y.isDown && right.isUp && !isAttacking)
        {
            this.stateMachine.transition(EPossibleState.RECOIL_LEFT, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.RECOIL_RIGHT) && right.isDown && y.isDown && left.isUp && !isAttacking)
        {
            this.stateMachine.transition(EPossibleState.RECOIL_RIGHT, this.stateMachine.state);

            return;
        }

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
            const { right, bottom } = character.body;

            const tile = scene.colliderLayer.getTileAtWorldXY(right, bottom + TILE_SIZE / 4);

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

            const tile = scene.colliderLayer.getTileAtWorldXY(left + 1, bottom - 1);

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
            const { left, bottom } = character.body;

            const tile = scene.colliderLayer.getTileAtWorldXY(left, bottom + TILE_SIZE / 4);

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_RIGHT))
            {
                character.body.reset(tile.pixelX + TILE_SIZE / 2, tile.pixelY - TILE_SIZE / 2);

                character.anims.pause();

                this.stateMachine.transition(EPossibleState.DOWNSTAIR_LEFT, this.stateMachine.state)

                return;
            }
        }

        if (character.canUse(EPossibleState.CROUCH) && down.isDown && !isAttacking)
        {
            this.stateMachine.transition(EPossibleState.CROUCH, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.FALL) && !blocked.down)
        {
            this.stateMachine.transition(EPossibleState.FALL, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.FLY_LEFT) && left.isDown)
        {
            this.stateMachine.transition(EPossibleState.FLY_LEFT, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.FLY_RIGHT) && right.isDown)
        {
            this.stateMachine.transition(EPossibleState.FLY_RIGHT, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.UP) && up.isDown)
        {
            this.stateMachine.transition(EPossibleState.UP, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.DOWN) && down.isDown)
        {
            this.stateMachine.transition(EPossibleState.DOWN, this.stateMachine.state);

            return;
        }
    }
}