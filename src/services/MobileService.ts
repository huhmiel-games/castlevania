export default class MobileService
{
    static isActive: boolean = false;
    static vibrate(duration: number, pauseDuration: number, repeat: number = 0)
    {
        if (this.isActive) return;

        this.isActive = true;

        const arr: number[] = [];

        for (let i = 0; i <= repeat; i += 1)
        {
            arr.push(duration, pauseDuration);
        }

        window.navigator.vibrate(arr);
    }

    static vibrateOut(duration: number, pauseDuration: number, repeat: number = 0)
    {
        if (this.isActive) return;

        this.isActive = true;

        const arr: number[] = [];

        for (let i = 0; i <= repeat; i += 1)
        {
            arr.push(duration / 2, pauseDuration / 2);
        }

        window.navigator.vibrate(arr);
    }
}