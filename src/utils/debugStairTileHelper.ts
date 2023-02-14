export function debugStairTileHelper(tile: Phaser.Tilemaps.Tile | undefined | null)
{
    if(tile && tile.tilemap)
    {
        const {scene} = tile.tilemap;
        tile.tint = 0x00ff00;

        scene.time.addEvent({
            delay: 1000,
            callback: () => {
                tile.tint = 0xffffff
            }
        })
    }
}