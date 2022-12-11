import GameScene from "../../scenes/GameScene";
import { Entity } from "../Entity";

export default abstract class Weapon
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    public parent: Entity;
    public damage: number;
    public attack: (...args: any) => void;
    public destroyObject: (_object: unknown) => void;
    public destroyTile: (_tile: Phaser.Tilemaps.Tile) => void;
    public setDisable: () => void;
}