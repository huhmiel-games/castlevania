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
 * @class GoDownstairRightState
 * @extends {State}
 */
export default class GoDownstairRightState extends State
{
    public stateMachine: StateMachine;
    private isMidStair: boolean = true;
    private stairTime: number = 0;
    private stairTile: Phaser.Tilemaps.Tile;
    private animFrameNumber: number = 0;
    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        this.stairTime = now;

        if (this.stateMachine.prevState === EPossibleState.RIGHT || this.stateMachine.prevState === EPossibleState.IDLE || this.stateMachine.prevState === EPossibleState.FALL)
        {
            this.isMidStair = true;

            character.setFrame(this.updateFrameName(character));
        }

        if (this.stateMachine.prevState === EPossibleState.UPSTAIR_LEFT)
        {
            character.setFrame(this.updateFrameName(character));
        }

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.setFlipX(false);

        character.body.setDrag(character.physicsProperties.acceleration * character.physicsProperties.dragCoeff).setAcceleration(0);

        console.log(character.name + ' GO DOWN STAIR RIGHT STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, right, up, down, a, b } = character.buttons;

        const { now } = scene.time;

        if ((left.isDown || up.isDown) && right.isUp && this.isMidStair)
        {
            this.stateMachine.transition(EPossibleState.UPSTAIR_LEFT, this.stateMachine.state, this.isMidStair);

            return;
        }

        if (character.canUse(EPossibleState.ATTACK) && a.isDown && up.isUp && a.getDuration(now) < 128 && !character.physicsProperties.isAttacking)
        {
            this.stateMachine.transition(EPossibleState.STAIR_ATTACK, this.stateMachine.state, 'down');

            return;
        }

        if (character.canUse(EPossibleState.SECONDARY_ATTACK) && a.isDown && up.isDown && a.getDuration(now) < 128 && !character.physicsProperties.isAttacking)
        {
            this.stateMachine.transition(EPossibleState.STAIR_SECONDARY_ATTACK, this.stateMachine.state, 'down');

            return;
        }

        if (character.canUse(EPossibleState.JUMP) && down.isUp && b.isDown && b.getDuration(now) < 150)
        {
            this.stateMachine.transition(EPossibleState.JUMP, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.FALL) && down.isDown && b.isDown && b.getDuration(now) < 150)
        {
            this.stateMachine.transition(EPossibleState.FALL, this.stateMachine.state);

            return;
        }

        if (right.isUp && left.isUp && down.isUp && this.isMidStair) return;

        const { x, y } = character.body.center;

        if (this.stairTile === undefined || this.stairTile === null || this.isMidStair === true)
        {
            this.stairTile = scene.colliderLayer.getTileAtWorldXY(x + TILE_SIZE / 4, y + TILE_SIZE / 4 * 3);
        }

        // middle stairs
        if (this.stairTile?.properties?.hasOwnProperty(TILES.STAIR_LEFT) && this.stairTime + character.physicsProperties.stairSpeed! < now)
        {
            if (this.isMidStair)
            {
                character.body.reset(character.body.x + TILE_SIZE , character.body.y + TILE_SIZE / 2);

                character.setFrame(character.frameList?.stairMiddle!);
            }
            else
            {
                character.setFrame(this.updateFrameName(character));
            }

            this.isMidStair = !this.isMidStair;

            this.stairTime = now;

            this.stateMachine.transition(EPossibleState.DOWNSTAIR_RIGHT, this.stateMachine.state);

            return;
        }

        // leave stairs
        if (!this.stairTile?.properties?.hasOwnProperty(TILES.STAIR_LEFT) && this.stairTime + character.physicsProperties.stairSpeed! < now)
        {
            this.isMidStair = true;

            this.stateMachine.transition(EPossibleState.IDLE, this.stateMachine.state);

            return;
        }
    }

    private updateFrameName(character): string
    {
        this.animFrameNumber = 1 - this.animFrameNumber;

        return `${character.frameList.stairDown}${this.animFrameNumber}`;
    }
}
