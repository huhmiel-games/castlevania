import { TCoord } from "../types/types";

/**
 * @author © Johann Leblanc @2023
 * @desc
 * @class Segment
 */
export class Segment
{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    length: number;

    constructor(x1: number, y1: number, x2: number, y2: number)
    {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    }

    getRelativePoint(relativePosition: number): TCoord
    {
        const rate = relativePosition / this.length;

        return {
            x: this.x1 + rate * (this.x2 - this.x1),
            y: this.y1 + rate * (this.y2 - this.y1),
        }
    }
}
