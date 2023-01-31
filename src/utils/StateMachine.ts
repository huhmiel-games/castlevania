import { EStates } from "../constant/character";
import { Entity } from "../entities/Entity";
import GameScene from "../scenes/GameScene";
import State from "./State";

type TStateArgs = [GameScene, Entity];
export default class StateMachine
{
    public initialState: EStates;
    public possibleStates: {[key: string]: State};
    public stateArgs: TStateArgs;
    public state: EStates;
    public prevState: EStates;

    constructor (initialState: EStates, possibleStates: {[key: string]: State}, stateArgs: TStateArgs)
    {
        this.initialState = initialState;

        this.possibleStates = possibleStates;

        this.stateArgs = stateArgs;

        // State instances get access to the state machine via this.stateMachine.
        for (const state of Object.values(this.possibleStates))
        {
            state.stateMachine = this;
        }
    }

    public step ()
    {
        // On the first step, the state is undefined and we need to initialize the first state.
        if (this.state === undefined)
        {
            this.state = this.initialState;

            this.possibleStates[this.state].enter(...this.stateArgs);
        }

        // Run the current state's execute
        this.possibleStates[this.state].execute(...this.stateArgs);
    }

    public transition (newState: EStates, prevState: EStates, ...enterArgs: unknown[])
    {
        this.state = newState;

        this.prevState = prevState;

        this.possibleStates[this.state || 0].enter(...this.stateArgs, ...enterArgs);
    }
}