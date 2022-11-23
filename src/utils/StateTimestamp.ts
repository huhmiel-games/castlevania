/**
 * @description A StateTimestamp class helper
 * @author © Philippe Pereira 2021
 * @export
 * @class StateTimestamp
 * @param stateName
 * @param timestamp
 */
export default class StateTimestamp
{
    private stateName: string;
    private timeState: number = 0;
    
    public getStateName (): string
    {
        return this.stateName;
    }

    public setStateName (value: string): void
    {
        this.stateName = value;
    }

    public getTimestamp (): number
    {
        return this.timeState;
    }

    public setTimeState (value: number): void
    {
        this.timeState = value;
    }

    public setNameAndTime (state: string, time: number)
    {
        this.stateName = state;
        this.timeState = time;
    }
}