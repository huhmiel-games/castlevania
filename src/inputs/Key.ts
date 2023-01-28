export class Key
{
    scene: Phaser.Scene | undefined;
    name: string;
    isDown: boolean = false;
    timeDown: number = 0;
    timeUp: number = 0;

    constructor(name: string, scene?: Phaser.Scene)
    {
        this.name = name;
        this.scene = scene;
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
        this.scene?.events.emit(this.name+'_DownEvent')
    }

    setUp(timestamp: number): void
    {
        if (this.isUp === true) return;

        this.isDown = false;
        this.timeUp = timestamp;
        this.scene?.events.emit(this.name+'_UpEvent')
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