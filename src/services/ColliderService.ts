import { spawnRetrievableItem } from '../custom/destroyCandle';
import DamageBody from '../entities/DamageBody';
import { Entity } from '../entities/Entity';
import { MeleeWeapon } from '../entities/weapons/MeleeWeapon';
import ThrowingBomb from '../entities/weapons/ThrowingBomb';
import Weapon from '../entities/weapons/Weapon';
import Conveyor from '../gameobjects/Conveyor';
import GameScene from '../scenes/GameScene';
import DoorService from './DoorService';
import LayerService from './LayerService';

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class ColliderService
 */
export default class ColliderService
{
    /**
     * @description Add the Colliders
     * @static
     */
    public static addColliders(scene: GameScene)
    {
        // full side collision tiles
        scene.colliderLayer.setCollisionByProperty({ collides: true });

        // one way collision tiles
        scene.colliderLayer.forEachTile((tile) =>
        {
            if(tile.properties.collides)
            {
                tile.setCollision(true, true, true, false);
            }

            if (tile.properties.leftBlock)
            {
                tile.setCollision(true, false, false, false);
            }

            if (tile.properties.rightBlock)
            {
                tile.setCollision(false, true, false, false);
            }

            if (tile.properties.topBlock)
            {
                tile.setCollision(false, false, true, false);
            }
        });

        scene.physics.add.collider(scene.movingPlatformGroup, scene.colliderLayer).setName('movingPlatformGroupVScolliderLayer');
        scene.physics.add.collider(scene.itemsGroup, scene.colliderLayer).setName('itemsGroupVScolliderLayer');

        // playable characters collisions
        const damageBodies = scene.characters.map(e => e.damageBody)
        scene.physics.add.overlap(damageBodies, scene.itemsGroup, (_entity, _item) =>
        {
            const damageBody = _entity as DamageBody;

            const entity = damageBody.parent;

            entity.getItem(_item as Phaser.Types.Physics.Arcade.GameObjectWithBody);
        }).setName('playersVSitemsGroup');

        scene.physics.add.collider(scene.characters, scene.movingPlatformGroup).setName('playersVSmovingPlatformGroup');

        scene.physics.add.collider(scene.characters, scene.conveyorGroup, (_player, _belt) =>
        {
            const player = _player as unknown as Entity;

            const belt = _belt as Conveyor;

            if (belt.body.touching.up && player.body.touching.down)
            {
                player.body.position.add(belt.surfaceSpeed);
            }
        }, undefined, scene).setName('playersVSconveyorGroup');

        scene.physics.add.overlap(scene.characters, scene.colliderLayer,
            (_player, _tile) =>
            {
                const tile = _tile as unknown as Phaser.Tilemaps.Tile;

                if (!tile.properties) return;

                if (tile.properties.doorBlock && !tile.canCollide)
                {
                    DoorService.searchNextStage(scene, tile);

                    return;
                }

                if (tile.properties.changeZoneBlock)
                {
                    scene.setCurrentStage();

                    tile.destroy();

                    return;
                }
            }
        ).setName('playersVScolliderLayer');

        scene.physics.add.collider(scene.characters, scene.colliderLayer, undefined,
            (_player, _tile) =>
            {
                const tile = _tile as unknown as Phaser.Tilemaps.Tile;

                if (!tile || !tile.tilemapLayer)
                {
                    return false;
                }

                return true;
            },
            scene
        ).setName('playersVScolliderLayer');

        // weapons collisions
        scene.physics.add.overlap(scene.weaponGroup, scene.colliderLayer, (_weapon, _tile) =>
        {
            const tile = _tile as unknown as Phaser.Tilemaps.Tile;

            if (tile.properties?.breakableBlock && _weapon instanceof MeleeWeapon)
            {
                const bottomTile = scene.colliderLayer.getTileAt(tile.x, tile.y + 1);

                if (bottomTile?.properties?.hasOwnProperty('leftBlock') || bottomTile?.properties?.hasOwnProperty('rightBlock'))
                {
                    bottomTile.setCollision(false, false, false, false, true).destroy();
                }

                LayerService.removeGroundTileAt(scene, tile);

                scene.playSound(21, 1);

                spawnRetrievableItem(scene, tile);

                tile.setCollision(false, false, false, false, true).destroy();
            }
        }, undefined, scene).setName('weaponGroupVScolliderLayer');

        scene.physics.add.collider(scene.weaponGroup, scene.colliderLayer, undefined, (_weapon, _tile) =>
        {
            if (_weapon instanceof ThrowingBomb)
            {
                return true;
            }

            return false;
        }, scene).setName('weaponGroupVScolliderLayer');

        const candlesLayer = LayerService.getGroundLayers(scene).find(e => e.name === 'ground/candles');

        if (candlesLayer)
        {
            scene.physics.add.overlap(scene.weaponGroup, candlesLayer,
                (_weapon, _candle) =>
                {
                    const weapon = _weapon as unknown as Weapon;

                    weapon.destroyObject(_candle);
                },
                (whip, candle) => (candle as Phaser.Tilemaps.Tile).index > 0, this
            ).setName('weaponGroupVScandleLayer')
        }

        scene.physics.add.collider(scene.enemies, scene.colliderLayer, undefined, (_enemy, _tile) =>
        {
            const enemy = _enemy as Entity;

            if(enemy.config.collideWithWorld === false)
            {
                return false;
            }

            return true;
        }, scene).setName('enemiesVScolliderLayer');
    }
}