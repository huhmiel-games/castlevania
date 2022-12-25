import { LIGHT_ATTENUATION, LIGHT_ATTENUATION_END, LIGHT_ATTENUATION_START, LIGHT_COLOR, LIGHT_INTENSITY, LIGHT_RADIUS, TILE_SIZE } from '../constant/config';
import { DEPTH } from '../constant/depth';
import { DOORS_TILE_INDEX } from '../constant/tiles';
import Conveyor from '../gameobjects/Conveyor';
import MovingPlatform from '../gameobjects/MovingPlatform';
import GameScene from '../scenes/GameScene';

const tilesetsNames = [
    'main',
    'rob-candles',
    'dark-background',
];

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class LayerService
 */
export default class LayerService
{


    /**
     * Add the layers
     */
    public static addLayers(scene: GameScene)
    {
        // layer that only handle collisions
        const colliderLayer = scene.map.createLayer('collider', 'colliderTileset', 0, 0)

        if (!colliderLayer) throw new Error("map creation failed");

        colliderLayer.setAlpha(0).setDepth(1000);

        scene.colliderLayer = colliderLayer;

        // Background layers
        this.addBackgroundLayers(scene)

        // Ground layers
        this.addGroundLayers(scene);

        //  Front layers
        this.addForegroundLayers(scene);

        this.addMovingPlatforms(scene);

        this.addConveyors(scene);
    }

    public static addConveyors(scene: GameScene)
    {
        scene.children.list.filter(e => e.name === 'conveyor').forEach(conveyor => {
            scene.children.remove(conveyor);
        });

        const conveyorLayer = this.getObjectLayerByName(scene, 'conveyor');

        if (!conveyorLayer) return;

        conveyorLayer.objects.forEach(conveyorObject =>
        {
            if (scene.isInPlayerStage(conveyorObject))
            {
                const properties = this.convertTiledObjectProperties(conveyorObject.properties);

                const width = properties?.width || 1;
    
                const reverse = properties?.reverse || false;
    
                const conveyor = new Conveyor(scene, conveyorObject.x!, conveyorObject.y! - 16, TILE_SIZE * width, 16);
    
                conveyor.setSpeed(0.5);
    
                if (reverse === true)
                {
                    conveyor.reverse();
                }
    
                scene.conveyorGroup.add(conveyor);
            }
        });
    }

    public static addMovingPlatforms(scene: GameScene)
    {
        scene.children.list.filter(e => e.name === 'movingPlatform').forEach(movingPlatform => {
            scene.children.remove(movingPlatform);
        });

        const platformLayer = this.getObjectLayerByName(scene, 'movingPlatform');

        if (!platformLayer) return;

        platformLayer.objects.forEach(platform =>
        {
            if (scene.isInPlayerStage(platform))
            {
                const newPlatform = new MovingPlatform({ scene: scene, x: platform.x! + TILE_SIZE, y: platform.y! - TILE_SIZE, texture: 'items', frame: 'movingPlatform' });

                scene.movingPlatformGroup.add(newPlatform);
            }
        });
    }

    public static addBackgroundLayers(scene: GameScene)
    {
        const backgroundLayers = scene.map.layers.filter(layer => layer.name.startsWith('background/'));
        backgroundLayers.forEach(layer =>
        {
            const layerElement = scene.map.createLayer(layer.name, tilesetsNames, 0, 0)?.setDepth(DEPTH.BACKGROUND_LAYER);
            // get the name of the layer
            const layerName = layer.name.split('/')[1];

            if (layerName === 'noscroll')
            {
                layerElement?.setScrollFactor(0, 0);
            }

            if (layerName === 'shadow')
            {
                layerElement?.setScrollFactor(0.5, 0);
            }

            layerElement?.setName(layerName);
        });
    }

    public static addGroundLayers(scene: GameScene)
    {
        const groundLayers = scene.map.layers.filter(layer => layer.name.startsWith('ground/'));
        groundLayers.forEach(layer =>
        {
            const layerElement = scene.map.createLayer(layer.name, tilesetsNames, 0, 0)?.setDepth(DEPTH.GROUND_LAYER);
            layerElement?.setName(layer.name);

            // if (this.getLayerName(layer) === 'candles')
            // {
            //     this.addCandlesPointLight(scene, layer)
            // }
        });
    }

    public static addForegroundLayers(scene: GameScene)
    {
        const foregroundLayers = scene.map.layers.filter(layer => layer.name.startsWith('foreground/'));
        foregroundLayers.forEach(layer =>
        {
            const layerElement = scene.map.createLayer(layer.name, tilesetsNames, 0, 0)?.setDepth(DEPTH.FRONT_LAYER);
            layerElement?.setName(layer.name);
        });
    }

    public static addCandlesPointLight(scene: GameScene)
    {
        scene.children.list.filter(e => e.name === 'candle').forEach(candle => {
            (candle as Phaser.GameObjects.PointLight).setActive(false).setVisible(false);
        });

        const layerCandle = this.getGroundLayers(scene).find(layer => this.getLayerName(layer.layer) === 'candles');

        if (!layerCandle) return;

        layerCandle.getTilesWithin().forEach(tile =>
        {
            if (tile.properties.light && scene.isInPlayerStage({ x: tile.pixelX, y: tile.pixelY }))
            {
                const candle = scene.lightCandlesGroup.get(tile.pixelX + TILE_SIZE / 2, tile.pixelY + TILE_SIZE / 4) as Phaser.GameObjects.PointLight;
                candle.attenuation = LIGHT_ATTENUATION;
                candle.radius = LIGHT_RADIUS;
                candle.intensity = LIGHT_INTENSITY;

                const color = Phaser.Display.Color.ColorToRGBA(LIGHT_COLOR);

                candle.color.setTo(color.r, color.g, color.b, color.a);
                candle.setActive(true).setVisible(true).setDepth(DEPTH.GROUND_LAYER + 1).setName('candle');
            }
        });

        // tween each PointLight
        scene.add.tween({
            targets: scene.children.list.filter(e => e.name === 'candle' && e.active),
            duration: 150,
            attenuation: { from: LIGHT_ATTENUATION_START, to: LIGHT_ATTENUATION_END },
            repeat: -1
        });
    }

    public static getGroundLayers(scene: GameScene): Phaser.Tilemaps.TilemapLayer[]
    {
        return scene.children.list.filter(layer => layer.name.startsWith('ground')) as Phaser.Tilemaps.TilemapLayer[];
    }

    public static getForegroundLayers(scene: GameScene): Phaser.Tilemaps.TilemapLayer[]
    {
        return scene.children.list.filter(layer => layer.name.startsWith('foreground')) as Phaser.Tilemaps.TilemapLayer[];
    }

    public static getBackgroundLayers(scene: GameScene): Phaser.Tilemaps.TilemapLayer[]
    {
        return scene.children.list.filter(layer => layer.name.startsWith('background')) as Phaser.Tilemaps.TilemapLayer[];
    }

    /**
     * Reveals the secret path
     * @param scene
     */
    public static showSecretPath(scene: GameScene)
    {
        const secretLayerData = scene.map.layers.find(layer => layer.name.startsWith('foreground/secret')) as Phaser.Tilemaps.LayerData;
        const secretLayer = secretLayerData.tilemapLayer;

        if (secretLayer.alpha === 0)
        {
            return;
        }

        scene.tweens.add({
            targets: secretLayer,
            duration: 150,
            alpha: 0
        });
    }

    public static removeLayers(scene: GameScene)
    {
        scene.map.layers.forEach(layer =>
        {
            if (layer.name !== 'collider')
            {
                scene.map.removeLayer(layer.name);
            }

        });
    }

    public static removeForegroundTileAt(scene: GameScene, tile: Phaser.Tilemaps.Tile): boolean
    {
        let result = false;
        // remove foreground tiles
        this.getForegroundLayers(scene).forEach(layer =>
        {
            const isTileExplode = layer.getTileAt(tile.x, tile.y);

            if (isTileExplode?.index !== -1)
            {
                result = true;

                layer.removeTileAt(tile.x, tile.y);
            }
        });

        return result;
    }

    public static removeGroundTileAt(scene: GameScene, tile: Phaser.Tilemaps.Tile): void
    {
        this.getGroundLayers(scene).forEach(layer =>
        {
            layer.removeTileAt(tile.x, tile.y);
        });
    }

    /**
     * Check for door tiles. 
     * If found, change them to open tiles and return true
     */
    public static openDoorTiles(scene: GameScene, tile: Phaser.Tilemaps.Tile): boolean
    {
        const groundLayer = this.getGroundLayers(scene).find(layer => layer.name === 'ground/ground');

        if (groundLayer === undefined) return false;

        const doorTileBottom = groundLayer.getTileAt(tile.x, tile.y, true);
        const doorTileMiddle = groundLayer.getTileAt(tile.x, tile.y - 1, true);
        const doorTileTop = groundLayer.getTileAt(tile.x, tile.y - 2, true);

        if (doorTileBottom.index === DOORS_TILE_INDEX.BOTTOM_CLOSED)
        {
            doorTileBottom.index = DOORS_TILE_INDEX.BOTTOM_OPEN;
            doorTileMiddle.index = DOORS_TILE_INDEX.MIDDLE_OPEN;
            doorTileTop.index = DOORS_TILE_INDEX.TOP_OPEN;

            return true;
        }

        return false;
    }

    public static addImageFromTile(scene: GameScene, layer: Phaser.Tilemaps.TilemapLayer, tile: Phaser.Tilemaps.Tile)
    {
        const currentTile = layer.getTileAt(tile.x, tile.y);

        if (!currentTile || !currentTile.tileset) return;

        const data = currentTile.tileset.getTileTextureCoordinates(currentTile.index) as { x: number, y: number };

        const { columns } = currentTile.tileset;

        const frame = data.x / 8 * data.y / 8 * columns + 1;

        scene.add.image(tile.pixelX, tile.pixelY, currentTile.tileset.name, frame).setDepth(3000);

    }

    private static getLayerName(layer: Phaser.Tilemaps.LayerData): string
    {
        return layer.name.split('/')[1];
    }

    /**
     * Return the layer object
     */
    public static getObjectLayerByName(scene: GameScene, layerName: string): Phaser.Tilemaps.ObjectLayer | null
    {
        const arr = scene.map.objects.find((elm) => elm.name === layerName);

        if (!arr)
        {
            return null;
        }

        return arr;
    }

    public static isLayerExists(scene: GameScene, layerName: string)
    {
        const layer = scene.map.layers.find((elm) => elm.name === layerName);

        if (!layer)
        {
            return false;
        }

        return true;
    }

    /**
     * Convert a Tiled Object Properties from array to an object
     * @param properties
     */
    public static convertTiledObjectProperties(properties: any[])
    {
        if (properties === undefined || !properties.length)
        {
            return undefined;
        }

        const props: { [key: string]: any } = {};

        properties.forEach(e =>
        {
            props[e.name] = e.value;
        });

        return props;
    }
}