export class Key
{
    name: string;
    alias: string;
    isDown: boolean = false;
    timeDown: number = 0;
    timeUp: number = 0;

    constructor(name: string, alias?: string)
    {
        this.name = name;
        this.alias = alias || name + 'Btn';
    }

    get isUp(): boolean
    {
        return !this.isDown;
    }

    setDown(timestamp: number): void
    {
        if (this.isDown === true) return;

        this.isDown = true;
        this.timeDown = timestamp;
    }

    setUp(timestamp: number): void
    {
        if (this.isUp === true) return;

        this.isDown = false;
        this.timeUp = timestamp;
    }

    /**
     * return now - timedown
     */
    getDuration(now: number): number
    {
        if (this.isDown)
        {
            return now - this.timeDown;
        }
        else
        {
            return 0;
        }
    }
}