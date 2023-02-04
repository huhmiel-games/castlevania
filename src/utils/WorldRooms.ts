import GameScene from '../scenes/GameScene';
import SaveLoadService from '../services/SaveLoadService';
import { TMap, TWorld } from '../types/types';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class WorldRooms
 */
export default class WorldRooms
{
    public static generate(scene: GameScene)
    {
        // get the Tiled world file
        const tiledWorld = scene.cache.json.get('mapWorld');

        // copy the Tiled world file to add door collision tiles
        const tiledWorldWithDoors: TWorld = { ...tiledWorld };

        // get the collider layer
        const collideLayerData = scene.colliderLayer.layer.data;

        const room = tiledWorldWithDoors.maps[0];
        room.doors = [];
        // add the doors
        

        // search the door tiles
        collideLayerData.forEach((tiles: Phaser.Tilemaps.Tile[]) =>
        {
            tiles.forEach((tile, i) => { this.handleTile(tile, room); });
        });

        // check if we need to update world.json
        this.checkMapDiff(scene, tiledWorldWithDoors);
    }

    static checkMapDiff(scene: GameScene, tiledWorldWithDoors: TWorld)
    {
        const tiledWorldWithDoorsJson = JSON.stringify(tiledWorldWithDoors);

        const savedWorld = SaveLoadService.getWorld();

        if (tiledWorldWithDoorsJson !== JSON.stringify(savedWorld))
        {
            SaveLoadService.saveWorld(tiledWorldWithDoors);
        }
    }

    static handleTile(tile: Phaser.Tilemaps.Tile, map: TMap)
    {
        if (tile.properties.doorBlock)
        {
            map.doors.push({ x: map.x + tile.pixelX, y: map.y + tile.pixelY });
        }
    }
}
