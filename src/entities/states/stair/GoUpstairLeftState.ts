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
 * @class GoUpstairLeftState
 * @extends {State}
 */
export default class GoUpstairLeftState extends State
{
    public stateMachine: StateMachine;
    private isMidStair: boolean = false;
    private stairTime: number = 0;
    private stairTile: Phaser.Tilemaps.Tile
    private animFrameNumber: number = 0;
    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        this.stairTime = now;

        if (this.stateMachine.prevState === EStates.LEFT || this.stateMachine.prevState === EStates.IDLE || this.stateMachine.prevState === EStates.FALL)
        {
            this.isMidStair = true;

            character.setFrame(this.updateFrameName(character));
        }

        if (this.stateMachine.prevState === EStates.DOWNSTAIR_RIGHT)
        {
            character.setFrame(this.updateFrameName(character));
        }

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.setFlipX(true);

        character.body.setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff).setAcceleration(0);

        log(character.name + ' GO UP STAIR LEFT STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b } = character.buttons;

        const { now } = scene.time;

        if ((right.isDown || down.isDown) && left.isUp && !this.isMidStair)
        {
            this.stateMachine.transition(EStates.DOWNSTAIR_RIGHT, this.stateMachine.state, this.isMidStair);

            return;
        }

        if (character.canUse(EStates.ATTACK) && a.isDown && up.isUp && a.getDuration(now) < 128 && !character.physicsProperties.isAttacking)
        {
            this.stateMachine.transition(EStates.STAIR_ATTACK, this.stateMachine.state, 'up');

            return;
        }

        if (character.canUse(EStates.SECONDARY_ATTACK) && a.isDown && up.isDown && a.getDuration(now) < 128 && !character.physicsProperties.isAttacking)
        {
            this.stateMachine.transition(EStates.STAIR_SECONDARY_ATTACK, this.stateMachine.state, 'up');

            return;
        }

        if (character.canUse(EStates.JUMP) && down.isUp && b.isDown && b.getDuration(now) < 150)
        {
            this.stateMachine.transition(EStates.JUMP, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.FALL) && down.isDown && b.isDown && b.getDuration(now) < 150)
        {
            this.stateMachine.transition(EStates.FALL, this.stateMachine.state);

            return;
        }

        if (right.isUp && left.isUp && up.isUp && !this.isMidStair) return;

        const { body } = character;

        const { x, y } = body.center;

        if (this.stairTile === undefined || this.stairTile === null || this.isMidStair === false)
        {
            this.stairTile = scene.colliderLayer.getTileAtWorldXY(x - TILE_SIZE / 4 * 3, y - TILE_SIZE / 4);
        }

        // middle stairs
        if (this.stairTile?.properties?.hasOwnProperty(TILES.STAIR_LEFT) && this.stairTime + character.physicsProperties.stairSpeed! < now)
        {
            if (this.isMidStair)
            {
                character.setFrame(this.updateFrameName(character));
            }
            else
            {
                body.reset(body.x, body.y - TILE_SIZE / 2);

                character.setFrame(character.frameStairList?.stairMiddleRight!);
            }

            this.isMidStair = !this.isMidStair;

            this.stairTime = now;

            this.stateMachine.transition(EStates.UPSTAIR_LEFT, this.stateMachine.state);

            return;
        }

        // leave stairs
        if (!this.stairTile?.properties?.hasOwnProperty(TILES.STAIR_LEFT) && this.stairTime + character.physicsProperties.stairSpeed! < now)
        {
            if (this.isMidStair)
            {
                this.isMidStair = !this.isMidStair;

                character.setFrame(this.updateFrameName(character));

                this.stateMachine.transition(EStates.UPSTAIR_LEFT, this.stateMachine.state);

                return;
            }

            body.reset(body.x - 4, body.y);

            character.setFrame(character.frameStairList?.stairMiddleLeft!);

            this.stateMachine.transition(EStates.IDLE, this.stateMachine.state);

            return;
        }
    }

    private updateFrameName(character: Entity): string
    {
        this.animFrameNumber = 1 - this.animFrameNumber;

        return `${character.frameStairList?.stairUp}${this.animFrameNumber}`;
    }
}