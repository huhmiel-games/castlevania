import { Entity } from '../entities/Entity';
import GameScene from '../scenes/GameScene';

abstract class State
{
    public abstract enter (scene: GameScene, character: Entity): void;

    public abstract execute (scene: GameScene, charater: Entity): void;
}

export default State;