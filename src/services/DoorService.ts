import { TILE_SIZE } from '../constant/config';
import GameScene from '../scenes/GameScene';
import { TDoor } from '../types/types';
import { warn } from '../utils/log';
import LayerService from './LayerService';
import SaveLoadService from './SaveLoadService';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class DoorService
 */
export default class DoorService
{
    public static searchNextStage(scene: GameScene, tile: Phaser.Tilemaps.Tile)
    {
        const doors = SaveLoadService.getWorld().maps[0].doors;

        // create an empty nextRoom object
        const nextZone: TDoor = {
            side: '',
            x: 0,
            y: 0,
        };

        // create an empty current door
        let currentDoor = { x: tile.pixelX, y: tile.pixelY };

        // search the next zone
        doors.forEach(door =>
        {
            // check lateral doors
            if (Math.abs(door.x > currentDoor.x ? door.x - currentDoor.x : currentDoor.x - door.x) === TILE_SIZE
                && door.y === currentDoor.y
            )
            {
                // calculate the local door position
                nextZone.x = door.x;
                nextZone.y = door.y;
                nextZone.side = currentDoor.x + TILE_SIZE === door.x ? 'right' : 'left';
            }

            // check vertical doors
            if (Math.abs(door.y > currentDoor.y ? door.y - currentDoor.y : currentDoor.y - door.y) === TILE_SIZE
                && door.x === currentDoor.x
            )
            {
                // calculate the local door position
                nextZone.x = door.x;
                nextZone.y = door.y;
                nextZone.side = tile.pixelY + TILE_SIZE === tile.tilemapLayer?.height ? 'bottom' : 'top';
            }
        });

        if (!nextZone.side) return warn('no zone found...');

        const doorFound = LayerService.openDoorTiles(scene, tile);

        tile.properties.doorBlock = false;
        tile.setCollision(true, true, true, true, true);

        scene.time.addEvent({
            delay: 32,
            callback: () =>
            {
                scene.colliderLayer.copy(tile.x, tile.y, 1, 1, tile.x, tile.y - 3);
                scene.colliderLayer.copy(tile.x, tile.y, 1, 1, tile.x, tile.y - 2);
                scene.colliderLayer.copy(tile.x, tile.y, 1, 1, tile.x, tile.y - 1);

                if (nextZone.side === 'left')
                {
                    const nextDoorBlockTile = scene.colliderLayer.getTileAt(tile.x - 1, tile.y);
                    nextDoorBlockTile.properties.doorBlock = false;
                }

                if (nextZone.side === 'right')
                {
                    const nextDoorBlockTile = scene.colliderLayer.getTileAt(tile.x + 1, tile.y);
                    nextDoorBlockTile.properties.doorBlock = false;
                }
            }
        })

        if (doorFound)
        {
            const doorSound = scene.sound.get('SFX30');

            scene.changeStage(nextZone);

            doorSound?.play();
        }
        else
        {
            warn('no door tiles');

            scene.changeStage(nextZone);
        }
    }
}
