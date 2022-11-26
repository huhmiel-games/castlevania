import { Entity } from '../entities/Entity';
import GameScene from '../scenes/GameScene';
import StateMachine from './StateMachine';

abstract class State
{
    public abstract stateMachine: StateMachine;
    public abstract enter (scene: GameScene, character: Entity, ...enterArgs: unknown[]): void;

    public abstract execute (scene: GameScene, charater: Entity, ...enterArgs: unknown[]): void;
}

export default State;