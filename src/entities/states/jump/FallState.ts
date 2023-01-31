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
 * @class FallState
 * @extends {State}
 */
export default class FallState extends State
{
    public stateMachine: StateMachine;
    private jumpTime: number = 0;
    public enter(scene: GameScene, character: Entity, jumpTime?: number)
    {
        log(character.name + ' FALL STATE');

        const { now } = scene.time;

        this.jumpTime = jumpTime || now;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.anims.play(character.animList.FALL!, true);

        character.body.setGravityY(character.physicsProperties.gravity)
            .setDrag(0)
            .setMaxVelocityY(character.physicsProperties.speed * 4);
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, up, a, b } = character.buttons;

        const { body, flipX } = character;

        const { isAttacking, acceleration, speed } = character.physicsProperties;

        const { now } = scene.time;

        if (character.canUse(EStates.FALL_SECONDARY_ATTACK)
            && up.isDown
            && a.isDown
            && a.getDuration(now) < 128 && !isAttacking
            && character.secondaryWeaponGroup.countActive(false) > 0
            && character.status.ammo > 0
        )
        {
            this.stateMachine.transition(EStates.FALL_SECONDARY_ATTACK, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.FALL_ATTACK) && a.isDown && a.getDuration(now) < 128 && !isAttacking)
        {
            this.stateMachine.transition(EStates.FALL_ATTACK, this.stateMachine.state, this.jumpTime);

            return;
        }

        // Transition to Idle if touching ground
        if (body.blocked.down)
        {
            character.y = Math.round(character.y); // fix a bug where the character is 1 pixel off from ground

            body.setMaxVelocityY(speed * 2);

            this.stateMachine.transition(EStates.IDLE, this.stateMachine.state);

            return;
        }

        // ghost jumping
        if ((this.stateMachine.prevState === EStates.LEFT || this.stateMachine.prevState === EStates.RIGHT)
            && this.jumpTime + 75 > now
            && b.isDown
        )
        {
            character.body.setMaxVelocityY(speed * 4);

            this.stateMachine.transition(EStates.JUMP, this.stateMachine.state);

            return;
        }

        if (flipX && character.canUse(EStates.UPSTAIR_LEFT) && up.isDown)
        {
            const { left, bottom } = body;

            const tile = scene.colliderLayer.getTileAtWorldXY(left, bottom);

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_RIGHT))
            {
                body.reset(tile.pixelX, tile.pixelY);
                character.anims.pause();

                this.stateMachine.transition(EStates.DOWNSTAIR_LEFT, this.stateMachine.state);

                return;
            }

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_LEFT))
            {
                body.reset(tile.pixelX + TILE_SIZE, tile.pixelY);
                character.anims.pause();

                this.stateMachine.transition(EStates.UPSTAIR_LEFT, this.stateMachine.state);

                return;
            }
        }

        if (!character.flipX && character.canUse(EStates.UPSTAIR_RIGHT) && up.isDown)
        {
            const { right, bottom } = body;

            const tile = scene.colliderLayer.getTileAtWorldXY(right - 1, bottom);

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_LEFT))
            {
                body.reset(tile.pixelX + TILE_SIZE / 2, tile.pixelY - 8);
                character.anims.pause();

                this.stateMachine.transition(EStates.DOWNSTAIR_RIGHT, this.stateMachine.state);

                return;
            }

            if (tile?.properties?.hasOwnProperty(TILES.STAIR_RIGHT))
            {
                body.reset(tile.pixelX, tile.pixelY);
                character.anims.pause();

                this.stateMachine.transition(EStates.UPSTAIR_RIGHT, this.stateMachine.state);

                return;
            }
        }

        if (left.isDown && right.isUp)
        {
            body.setAcceleration(-acceleration * 5, acceleration * 5);

            character.setFlipX(true);

            return;
        }

        if (right.isDown && left.isUp)
        {
            body.setAcceleration(acceleration * 5, acceleration * 5);

            character.setFlipX(false);

            return;
        }

        body.setAccelerationY(acceleration * 5);
    }
}