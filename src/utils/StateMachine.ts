import { Entity } from "../entities/Entity";
import GameScene from "../scenes/GameScene";
import State from "./State";

export default class StateMachine
{
    public initialState: string;
    public possibleStates: State;
    public stateArgs: (GameScene | Entity)[];
    public state: any;
    public prevState: string;

    constructor (initialState: string, possibleStates: any, stateArgs: any[] = [])
    {
        this.initialState = initialState;

        this.possibleStates = possibleStates;

        this.stateArgs = stateArgs;

        this.state = null;

        // State instances get access to the state machine via this.stateMachine.
        for (const state of Object.values(this.possibleStates))
        {
            state.stateMachine = this;
        }
    }

    public step ()
    {
        // On the first step, the state is null and we need to initialize the first state.
        if (this.state === null)
        {
            this.state = this.initialState;

            this.possibleStates[this.state].enter(...this.stateArgs);
        }

        // Run the current state's execute
        this.possibleStates[this.state].execute(...this.stateArgs);
    }

    public transition (newState: string, prevState: string, ...enterArgs: any[])
    {
        this.state = newState;

        this.prevState = prevState;

        this.possibleStates[this.state || 0].enter(...this.stateArgs, ...enterArgs);
    }
}