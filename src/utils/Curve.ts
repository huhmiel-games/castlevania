import { GameObjects } from "phaser";
import { TCoord } from "../types/types";
import { Segment } from "./Segment";

/**
 * @author © Johann Leblanc @2023
 * @desc
 * @class Curve
 */
export class Curve
{
    fixedX: number;
    fixedY: number;
    movingX: number;
    movingY: number;
    id: number;
    segments: Segment[];
    length: number;

    constructor(fixedGameObject: Phaser.GameObjects.Components.Transform, movingGameObject: Phaser.GameObjects.Components.Transform, id: number)
    {
        this.fixedX = fixedGameObject.x;
        this.fixedY = fixedGameObject.y;
        this.movingX = movingGameObject.x;
        this.movingY = movingGameObject.y;
        this.id = id;

        this.segments = [...Array((this.id - 1))].map(
            (_, i) =>
                new Segment(
                    this.equationX(i ),
                    this.equationY(i ),
                    this.equationX((i + 1) ),
                    this.equationY((i + 1) )
                )
        )
        this.length = 0;

        this.segments.forEach(item => this.length += item.length);
    }


    equationX(position: number): number
    {
        return this.fixedX + position * (this.movingX - this.fixedX) / (this.id - 1)
    }

    equationY(position: number): number
    {
        const amplitude = 1.1; // autour de 1.2
        const ratioAngle = 2.5; // autour 1.5
        return this.fixedY + Math.sin(position / ((this.id - 1) / ratioAngle)) * (this.movingY - this.fixedY) * amplitude // amplitiude y
    }

    equation(position: number): TCoord
    {
        return {
            x: this.equationX(position),
            y: this.equationY(position)
        }
    }


    getCorrectedPoints(position: number): TCoord
    {
        let relativePosition = position / (this.id - 1) * this.length;

        let result = { x: this.movingX, y: this.movingY };

        this.segments.forEach(item =>
        {
            if (0 <= relativePosition)
            {
                result = item.getRelativePoint(relativePosition);
            }

            relativePosition -= item.length;
        })

        return result;
    }
}
