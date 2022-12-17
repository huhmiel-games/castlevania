import { PLAYER_A_NAME, TILE_SIZE } from "../constant/config";
import AmmoRetrievableItem from "../gameobjects/AmmoRetrievableItem";
import BigAmmoRetrievableItem from "../gameobjects/BigAmmoRetrievableItem";
import GameScene from "../scenes/GameScene";
import LayerService from "../services/LayerService";
import ScoreRetrievableItem from "../gameobjects/ScoreRetrievableItem";
import WeaponRetrievableItem from "../gameobjects/WeaponRetrievableItem";
import BaseRetrievableItem from "../gameobjects/BaseRetrievableItem";
import Player from "./Player";

export default function destroyCandle(scene: GameScene, _whip: unknown, _candle: unknown)
{
    let candle = _candle as Phaser.Tilemaps.Tile;

    if (!scene.isInPlayerStage({ x: candle.pixelX, y: candle.pixelY }))
    {
        return;
    }

    if (!candle.properties.light) return;

    // give an heart
    spawnRetrievableItem(scene, candle)

    const lights = scene.lightCandlesGroup.getChildren() as Phaser.GameObjects.PointLight[];

    const light = findLight(candle, lights)

    light?.setActive(false).setVisible(false);

    candle.index = -1;

    scene.playSound(15);
}

function findLight(candle: Phaser.Tilemaps.Tile, lights: Phaser.GameObjects.PointLight[])
{
    return lights.find((light) => Phaser.Math.Distance.BetweenPoints({ x: candle.pixelX, y: candle.pixelY }, light) < 10)
}

export function spawnRetrievableItem(scene: GameScene, candle: Phaser.Tilemaps.Tile)
{
    const itemLayer = LayerService.getObjectLayerByName(scene, 'items') as Phaser.Tilemaps.ObjectLayer;

    const itemObject = itemLayer.objects.find(item => item.x === candle.pixelX && item.y === candle.pixelY + TILE_SIZE);

    const itemProperties = LayerService.convertTiledObjectProperties(itemObject?.properties);

    if (!itemProperties) return;

    switch (itemProperties.item)
    {
        case 'double-shot':
            if (scene.secondaryWeaponGroup.getLength() === 0)
            {
                itemProperties.item = 'big-heart';
            }
            else
            {
                const player = scene.getPlayerByName(PLAYER_A_NAME) as Player;

                if (player.multipleShots === 1)
                {
                    const doubleShot = new BaseRetrievableItem({ scene: scene, x: candle.pixelX, y: candle.pixelY, texture: 'items', frame: 'double-shot', quantity: 1, name: 'double-shot' })
                    scene.itemsGroup.add(doubleShot);
                    setItemTimer(scene, doubleShot);
                    break;
                }

                if (player.multipleShots === 2)
                {
                    const tripleShot = new BaseRetrievableItem({ scene: scene, x: candle.pixelX, y: candle.pixelY, texture: 'items', frame: 'triple-shot', quantity: 1, name: 'triple-shot' })
                    scene.itemsGroup.add(tripleShot);
                    setItemTimer(scene, tripleShot);
                    break;
                }
            }

        case 'heart':
            const heart = new AmmoRetrievableItem({ scene: scene, x: candle.pixelX, y: candle.pixelY, texture: 'items', frame: 'little-heart', quantity: 1 });
            scene.itemsGroup.add(heart);
            setItemTimer(scene, heart);
            break;

        case 'bigheart':
            const bigheart = new BigAmmoRetrievableItem({ scene: scene, x: candle.pixelX, y: candle.pixelY, texture: 'items', frame: 'big-heart', quantity: 5 });
            scene.itemsGroup.add(bigheart);
            setItemTimer(scene, bigheart);
            break;

        case 'red-bag':
            const redBag = new ScoreRetrievableItem({ scene: scene, x: candle.pixelX, y: candle.pixelY, texture: 'items', frame: 'purple-bag', quantity: 100 });
            scene.itemsGroup.add(redBag);
            setItemTimer(scene, redBag);
            break;

        case 'purple-bag':
            const purpleBag = new ScoreRetrievableItem({ scene: scene, x: candle.pixelX, y: candle.pixelY, texture: 'items', frame: 'purple-bag', quantity: 400 });
            scene.itemsGroup.add(purpleBag);
            setItemTimer(scene, purpleBag);
            break;

        case 'white-bag':
            const whiteBag = new ScoreRetrievableItem({ scene: scene, x: candle.pixelX, y: candle.pixelY, texture: 'items', frame: 'purple-bag', quantity: 700 });
            scene.itemsGroup.add(whiteBag);
            setItemTimer(scene, whiteBag);
            break;

        case 'dagger':
            const dagger = new WeaponRetrievableItem({ scene: scene, x: candle.pixelX, y: candle.pixelY, texture: 'items', frame: 'dagger', quantity: 1, name: 'dagger' })
            scene.itemsGroup.add(dagger);
            setItemTimer(scene, dagger);
            break;

        case 'holy-water':
            const holyWater = new WeaponRetrievableItem({ scene: scene, x: candle.pixelX, y: candle.pixelY, texture: 'items', frame: 'holy-water', quantity: 1, name: 'holyWater' })
            scene.itemsGroup.add(holyWater);
            setItemTimer(scene, holyWater);
            break;

        case 'axe':
            const axe = new WeaponRetrievableItem({ scene: scene, x: candle.pixelX, y: candle.pixelY, texture: 'items', frame: 'axe', quantity: 1, name: 'axe' })
            scene.itemsGroup.add(axe);
            setItemTimer(scene, axe);
            break;

        case 'cross':
            const cross = new WeaponRetrievableItem({ scene: scene, x: candle.pixelX, y: candle.pixelY, texture: 'items', frame: 'cross', quantity: 1, name: 'cross' })
            scene.itemsGroup.add(cross);
            setItemTimer(scene, cross);
            break;

        case 'rosary':
            const rosary = new BaseRetrievableItem({ scene: scene, x: candle.pixelX, y: candle.pixelY, texture: 'items', frame: 'rosary', quantity: 1, name: 'rosary' })
            scene.itemsGroup.add(rosary);
            setItemTimer(scene, rosary);
            break;

        case 'pork':
            const pork = new BaseRetrievableItem({ scene: scene, x: candle.pixelX, y: candle.pixelY, texture: 'items', frame: 'pork', quantity: 1, name: 'pork' })
            scene.itemsGroup.add(pork);
            setItemTimer(scene, pork);
            break;

        default:
            break;
    }

    function setItemTimer(scene: GameScene, item: BaseRetrievableItem)
    {
        scene.time.addEvent({
            delay: 5000,
            callback: () =>
            {
                if (!item.active) return;

                setItemTween(scene, item)
            }
        })
    }

    function setItemTween(scene: GameScene, item: BaseRetrievableItem)
    {
        scene.tweens.add({
            targets: item,
            duration: 250,
            yoyo: true,
            repeat: 4,
            alpha: {
                from: 0,
                to: 1
            },
            onComplete: () =>
            {
                if (!item.active) return;

                item.setDisable();
            }
        })
    }
}
