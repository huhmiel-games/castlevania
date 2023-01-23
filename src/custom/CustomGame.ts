import { BOSS_NAMES, ENEMY_NAMES, EPossibleState } from "../constant/character";
import { TILE_SIZE, PLAYER_A_NAME, HEIGHT, ATLAS_NAMES } from "../constant/config";
import { DEPTH } from "../constant/depth";
import { TILE_ITEMS } from "../constant/tiles";
import { WEAPON_NAMES } from "../constant/weapons";
import enemyJSON from '../data/enemy.json';
import DamageBody from "../entities/DamageBody";
import { Entity } from "../entities/Entity";
import ThrowingKnife from "../entities/weapons/ThrowingKnife";
import Weapon from "../entities/weapons/Weapon";
import AmmoRetrievableItem from "../gameobjects/AmmoRetrievableItem";
import BaseRetrievableItem from "../gameobjects/BaseRetrievableItem";
import BigAmmoRetrievableItem from "../gameobjects/BigAmmoRetrievableItem";
import { Orb } from "../gameobjects/Orb";
import ScoreRetrievableItem from "../gameobjects/ScoreRetrievableItem";
import WeaponRetrievableItem from "../gameobjects/WeaponRetrievableItem";
import { InputController } from "../inputs/InputController";
import GameScene from "../scenes/GameScene";
import LayerService from "../services/LayerService";
import SaveLoadService from "../services/SaveLoadService";
import { ICustomEffect, ICustomGame, TEntityConfig, TStatus } from "../types/types";
import { DeathIA } from "./boss_ia/DeathIA";
import { Dracula2IA } from "./boss_ia/Dracula2IA";
import { DraculaIA } from "./boss_ia/DraculaIA";
import { FrankIA } from "./boss_ia/FrankIA";
import { GiantBatIA } from "./boss_ia/GiantBatIA";
import { IgorIA } from "./boss_ia/IgorIA";
import { MedusaBossIA } from "./boss_ia/MedusaBossIA";
import { MummyIA } from "./boss_ia/MummyIA";
import { AxeKnightIA } from "./enemies_ia/AxeKnightIA";
import { BatBlueIA } from "./enemies_ia/BatBlueIA";
import { BatIA } from "./enemies_ia/BatIA";
import { BoneDragonIA } from "./enemies_ia/BoneDragonIA";
import { CatIA } from "./enemies_ia/CatIA";
import { DragonHeadIA } from "./enemies_ia/DragonHeadIA";
import { EagleIA } from "./enemies_ia/EagleIA";
import { FishmanIA } from "./enemies_ia/FishmanIA";
import { FleamanIA } from "./enemies_ia/FleamanIA";
import { GhostIA } from "./enemies_ia/GhostIA";
import { GiantBatBridgeIA } from "./enemies_ia/GiantBatBridgeIA";
import { MedusaIA } from "./enemies_ia/MedusaIA";
import { MovingSpikeIA } from "./enemies_ia/MovingSpikeIA";
import { RavenIA } from "./enemies_ia/RavenIA";
import { SkeletonIA } from "./enemies_ia/SkeletonIA";
import { SkeletonRedIA } from "./enemies_ia/SkeletonRedIA";
import { SpearKnightIA } from "./enemies_ia/SpearKnightIA";
import { ZombieIA } from "./enemies_ia/ZombieIA";
import { Boss } from "./entities/Boss";
import { Enemy } from "./entities/Enemy";
import Player from "./entities/Player";
import { RainEffect } from "./environmentEffects/Rain";

export class CustomeGame implements ICustomGame
{
    public scene: GameScene;
    public customEffects: Map<string, ICustomEffect> = new Map();
    public isOrb: boolean = false;
    public enemiesVsWeaponsCollider: Phaser.Physics.Arcade.Collider;
    public enemiesVsPlayerCollider: Phaser.Physics.Arcade.Collider;
    public enemiesWeaponsVsPlayerCollider: Phaser.Physics.Arcade.Collider;
    public weaponGroupVsEnemiesSecondaryWeapons: Phaser.Physics.Arcade.Collider;
    public enemiesSecondaryWeapons: Phaser.GameObjects.GameObject[];
    public enemiesDamageBody: DamageBody[] = [];

    constructor(scene: GameScene)
    {
        this.scene = scene;
    }

    public init()
    {
        const dataJson = SaveLoadService.loadGameData();

        let data: TStatus | undefined;

        if (dataJson)
        {
            data = JSON.parse(dataJson);
        }

        if (!data)
        {
            const newData: TStatus = {
                health: 16,
                life: 3,
                score: 0,
                stage: 11,
                ammo: 5,
                canTakeStairs: false,
                position: {
                    x: 2 * TILE_SIZE,
                    y: 69 * TILE_SIZE
                }
            }

            SaveLoadService.saveNewGameData(newData);

            data = newData;
        }

        for (let i = 1; i < 16; i += 1)
        {
            try
            {
                this.scene.sound.add(i.toString())
            } catch (error)
            {

            }
        }

        const playerA = new Player({
            scene: this.scene,
            x: data.position.x,
            y: data.position.y,
            texture: ATLAS_NAMES.PLAYER,
            frame: '',
            buttons: this.scene.inputController.playerAButtons
        });

        this.scene.characters.push(playerA);

        // background image
        this.scene.add.image(0, 0, 'back-moon').setOrigin(0, 0).setScrollFactor(0, 0).setName('back-moon');

        this.scene.add.tileSprite(0, 0, this.scene.map.widthInPixels, 176, 'back-mountain')
            .setOrigin(0, 0)
            .setName('parallax-mountain')
            .setScrollFactor(0.2, 0);

        this.scene.add.image(112, 16, 'back-castle')
            .setOrigin(0, 0)
            .setScrollFactor(0.05, 0.3)
            .setName('back-castle');

        this.scene.add.image(896 - 256, 912, 'back-castle-entrance').setOrigin(0, 0).setDepth(DEPTH.GROUND_LAYER);
        this.scene.add.image(896 + 80 - 256, 912 + 112, 'back-castle-entrance-front').setOrigin(0, 0).setDepth(DEPTH.FRONT_LAYER);
        this.scene.add.image(330 * 16, 0, 'back-clock').setOrigin(0, 0).setDepth(DEPTH.GROUND_LAYER);

        this.scene.sound.add('SFX30'); // door sound
    }

    public destroyTileItem(_whip: unknown, _tileItem: unknown)
    {
        let tileItem = _tileItem as Phaser.Tilemaps.Tile;

        if (!this.scene.isInPlayerStage({ x: tileItem.pixelX, y: tileItem.pixelY }))
        {
            return;
        }

        if (!tileItem.properties.light) return;

        // give an heart
        this.spawnRetrievableItem(tileItem);

        const lights = this.scene.lightItemsGroup.getChildren() as Phaser.GameObjects.PointLight[];

        const light = this.findLight(tileItem, lights);

        light?.setActive(false).setVisible(false);

        tileItem.index = -1;

        this.scene.playSound(15);
    }

    public findLight(tileItem: Phaser.Tilemaps.Tile, lights: Phaser.GameObjects.PointLight[])
    {
        return lights.find((light) => Phaser.Math.Distance.BetweenPoints({ x: tileItem.pixelX, y: tileItem.pixelY }, light) < 10)
    }

    public spawnRetrievableItem(tileItem: Phaser.Tilemaps.Tile)
    {
        const itemLayer = LayerService.getObjectLayerByName(this.scene, ATLAS_NAMES.ITEMS) as Phaser.Tilemaps.ObjectLayer;

        const itemObject = itemLayer.objects.find(item => item.x === tileItem.pixelX && item.y === tileItem.pixelY + TILE_SIZE);

        const itemProperties = LayerService.convertTiledObjectProperties(itemObject?.properties);

        if (!itemProperties) return;

        switch (itemProperties.item)
        {
            case TILE_ITEMS.DOUBLE_SHOT:
                if (this.scene.playersSecondaryWeaponGroup.getLength() === 0)
                {
                    itemProperties.item = TILE_ITEMS.BIG_HEART;
                }
                else
                {
                    const player = this.scene.getPlayerByName(PLAYER_A_NAME) as Player;

                    if (player.multipleShots === 1)
                    {
                        const doubleShot = new BaseRetrievableItem({ scene: this.scene, x: tileItem.pixelX, y: tileItem.pixelY, texture: ATLAS_NAMES.ITEMS, frame: TILE_ITEMS.DOUBLE_SHOT, quantity: 1, name: TILE_ITEMS.DOUBLE_SHOT })
                        this.scene.itemsGroup.add(doubleShot);
                        this.setItemTimer(doubleShot);
                        break;
                    }

                    if (player.multipleShots === 2)
                    {
                        const tripleShot = new BaseRetrievableItem({ scene: this.scene, x: tileItem.pixelX, y: tileItem.pixelY, texture: ATLAS_NAMES.ITEMS, frame: 'triple-shot', quantity: 1, name: 'triple-shot' })
                        this.scene.itemsGroup.add(tripleShot);
                        this.setItemTimer(tripleShot);
                        break;
                    }
                }

            case TILE_ITEMS.HEART:
                const heart = new AmmoRetrievableItem({ scene: this.scene, x: tileItem.pixelX, y: tileItem.pixelY, texture: ATLAS_NAMES.ITEMS, frame: 'little-heart', quantity: 1 });
                this.scene.itemsGroup.add(heart);
                this.setItemTimer(heart);
                break;

            case TILE_ITEMS.BIG_HEART:
                const bigheart = new BigAmmoRetrievableItem({ scene: this.scene, x: tileItem.pixelX, y: tileItem.pixelY, texture: ATLAS_NAMES.ITEMS, frame: 'big-heart', quantity: 5 });
                this.scene.itemsGroup.add(bigheart);
                this.setItemTimer(bigheart);
                break;

            case TILE_ITEMS.RED_BAG:
                const redBag = new ScoreRetrievableItem({ scene: this.scene, x: tileItem.pixelX, y: tileItem.pixelY, texture: ATLAS_NAMES.ITEMS, frame: 'purple-bag', quantity: 100 });
                this.scene.itemsGroup.add(redBag);
                this.setItemTimer(redBag);
                break;

            case TILE_ITEMS.PURPLE_BAG:
                const purpleBag = new ScoreRetrievableItem({ scene: this.scene, x: tileItem.pixelX, y: tileItem.pixelY, texture: ATLAS_NAMES.ITEMS, frame: 'purple-bag', quantity: 400 });
                this.scene.itemsGroup.add(purpleBag);
                this.setItemTimer(purpleBag);
                break;

            case TILE_ITEMS.WHITE_BAG:
                const whiteBag = new ScoreRetrievableItem({ scene: this.scene, x: tileItem.pixelX, y: tileItem.pixelY, texture: ATLAS_NAMES.ITEMS, frame: 'purple-bag', quantity: 700 });
                this.scene.itemsGroup.add(whiteBag);
                this.setItemTimer(whiteBag);
                break;

            case TILE_ITEMS.DAGGER:
                const dagger = new WeaponRetrievableItem({ scene: this.scene, x: tileItem.pixelX, y: tileItem.pixelY, texture: ATLAS_NAMES.ITEMS, frame: 'dagger', quantity: 1, name: 'dagger' })
                this.scene.itemsGroup.add(dagger);
                this.setItemTimer(dagger);
                break;

            case TILE_ITEMS.HOLY_WATER:
                const holyWater = new WeaponRetrievableItem({ scene: this.scene, x: tileItem.pixelX, y: tileItem.pixelY, texture: ATLAS_NAMES.ITEMS, frame: 'holy-water', quantity: 1, name: 'holy-water' })
                this.scene.itemsGroup.add(holyWater);
                this.setItemTimer(holyWater);
                break;

            case TILE_ITEMS.AXE:
                const axe = new WeaponRetrievableItem({ scene: this.scene, x: tileItem.pixelX, y: tileItem.pixelY, texture: ATLAS_NAMES.ITEMS, frame: 'axe', quantity: 1, name: 'axe' })
                this.scene.itemsGroup.add(axe);
                this.setItemTimer(axe);
                break;

            case TILE_ITEMS.CROSS:
                const cross = new WeaponRetrievableItem({ scene: this.scene, x: tileItem.pixelX, y: tileItem.pixelY, texture: ATLAS_NAMES.ITEMS, frame: 'cross', quantity: 1, name: 'cross' })
                this.scene.itemsGroup.add(cross);
                this.setItemTimer(cross);
                break;

            case TILE_ITEMS.ROSARY:
                const rosary = new BaseRetrievableItem({ scene: this.scene, x: tileItem.pixelX, y: tileItem.pixelY, texture: ATLAS_NAMES.ITEMS, frame: 'rosary', quantity: 1, name: 'rosary' })
                this.scene.itemsGroup.add(rosary);
                this.setItemTimer(rosary);
                break;

            case TILE_ITEMS.PORK:
                const pork = new BaseRetrievableItem({ scene: this.scene, x: tileItem.pixelX, y: tileItem.pixelY, texture: ATLAS_NAMES.ITEMS, frame: 'pork', quantity: 1, name: 'pork' })
                this.scene.itemsGroup.add(pork);
                this.setItemTimer(pork);
                break;

            default:
                break;
        }
    }

    public setItemTimer(item: BaseRetrievableItem)
    {
        this.scene.time.addEvent({
            delay: 5000,
            callback: () =>
            {
                if (!item.active) return;

                this.setItemTween(item)
            }
        })
    }

    private setItemTween(item: BaseRetrievableItem)
    {
        this.scene.tweens.add({
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

    public addOrb()
    {
        if (this.isOrb) return;

        this.isOrb = true;

        this.scene.time.addEvent({
            delay: 1000,
            callback: () =>
            {
                const cam = this.scene.cameras.main;

                const orb = new Orb({ scene: this.scene, x: cam.worldView.centerX, y: cam.worldView.centerY - 64, texture: ATLAS_NAMES.ITEMS, frame: 'magic-crystal_0' });

                this.scene.itemsGroup.add(orb);
            }
        });
    }

    setAIEnemy(enemy: Enemy | Boss)
    {
        switch (enemy.name)
        {
            case ENEMY_NAMES.ZOMBIE:
                enemy.setAi(new ZombieIA(enemy));
                break;
            case ENEMY_NAMES.BAT:
                enemy.setAi(new BatIA(enemy));
                break;
            case ENEMY_NAMES.BAT_BLUE:
                enemy.setAi(new BatBlueIA(enemy));
                break;
            case ENEMY_NAMES.MEDUSA:
                enemy.setAi(new MedusaIA(enemy));
                break;
            case ENEMY_NAMES.SPEAR_KNIGHT:
                enemy.setAi(new SpearKnightIA(enemy));
                break;
            case ENEMY_NAMES.CAT:
                enemy.setAi(new CatIA(enemy));
                break;
            case ENEMY_NAMES.FISHMAN:
                enemy.setAi(new FishmanIA(enemy));
                break;
            case ENEMY_NAMES.GHOST:
                enemy.setAi(new GhostIA(enemy));
                break;
            case ENEMY_NAMES.DRAGON_HEAD:
                enemy.setAi(new DragonHeadIA(enemy));
                break;
            case ENEMY_NAMES.SKELETON:
                enemy.setAi(new SkeletonIA(enemy));
                break;
            case ENEMY_NAMES.RAVEN:
                enemy.setAi(new RavenIA(enemy));
                break;
            case ENEMY_NAMES.EAGLE:
                enemy.setAi(new EagleIA(enemy));
                break;
            case ENEMY_NAMES.BONE_DRAGON:
                enemy.setAi(new BoneDragonIA(enemy));
                break;
            case ENEMY_NAMES.SKELETON_RED:
                enemy.setAi(new SkeletonRedIA(enemy));
                break;
            case ENEMY_NAMES.FLEAMAN:
                enemy.setAi(new FleamanIA(enemy));
                break;
            case ENEMY_NAMES.AXE_KNIGHT:
                enemy.setAi(new AxeKnightIA(enemy));
                break;
            case ENEMY_NAMES.SPIKE:
                enemy.setAi(new MovingSpikeIA(enemy));
                break;
            case ENEMY_NAMES.GIANT_BAT:
                enemy.setAi(new GiantBatIA(enemy as Boss));
                break;
            case ENEMY_NAMES.MEDUSA_BOSS:
                enemy.setAi(new MedusaBossIA(enemy as Boss));
                break;
            case ENEMY_NAMES.MUMMY:
                enemy.setAi(new MummyIA(enemy as Boss));
                break;
            case ENEMY_NAMES.FRANK:
                enemy.setAi(new FrankIA(enemy as Boss));
                break;
            case ENEMY_NAMES.IGOR:
                enemy.setAi(new IgorIA(enemy as Boss));
                break;
            case ENEMY_NAMES.DEATH:
                enemy.setAi(new DeathIA(enemy as Boss));
                break;
            case ENEMY_NAMES.BAT_BRIDGE:
                enemy.setAi(new GiantBatBridgeIA(enemy as Enemy));
                break;
            case ENEMY_NAMES.DRACULA:
                enemy.setAi(new DraculaIA(enemy as Boss));
                break;
            case ENEMY_NAMES.DRACULA_2:
                enemy.setAi(new Dracula2IA(enemy as Boss));
                break;

            default:
                break;
        }
    }

    addEnemies()
    {
        // destroy enemies related colliders
        this.destroyEnemyColliders();

        // destroy old zone enemies
        for (let i = 0; i < this.scene.enemies.length; i += 1)
        {
            const enemy = this.scene.enemies[i];
            this.scene.enemies[i].destroy();
            this.scene.enemies.splice(i, 1);
            this.scene.children.remove(enemy.damageBody);
            this.scene.children.remove(enemy);
            if (enemy.name === ENEMY_NAMES.SPIKE)
            {
                const screw = this.scene.children.getByName('spikeScrew');

                if (screw)
                {
                    this.scene.children.remove(screw);
                }
            }

            enemy.kill();
        }
        this.scene.enemies.forEach((enemy) =>
        {
            enemy.destroy();
            this.scene.children.remove(enemy.damageBody);
            this.scene.children.remove(enemy);
            if (enemy.name === ENEMY_NAMES.SPIKE)
            {
                const screw = this.scene.children.getByName('spikeScrew');

                if (screw)
                {
                    this.scene.children.remove(screw);
                }
            }

            enemy.kill();
        });

        this.scene.enemyWeaponGroup.clear(true);

        // create zone enemies
        const enemyLayer = LayerService.getObjectLayerByName(this.scene, ATLAS_NAMES.ENEMIES);

        const inputController = InputController.getInstance();

        enemyLayer?.objects.forEach((enemyObj, i) =>
        {
            if (this.scene.isInPlayerStage(enemyObj))
            {
                const enemyName: string = LayerService.convertTiledObjectProperties(enemyObj.properties)?.name;

                const enemyJSONConfig: TEntityConfig = JSON.parse(JSON.stringify(enemyJSON[enemyName]));
                enemyJSONConfig.status.position.x = enemyObj.x!;
                enemyJSONConfig.status.position.y = enemyObj.y!;

                if (BOSS_NAMES.includes(enemyName))
                {
                    this.addBoss(enemyName, enemyObj, enemyJSONConfig);

                    return
                }

                const enemy = new Enemy({
                    scene: this.scene,
                    x: enemyObj.x!,
                    y: enemyObj.y!,
                    texture: ATLAS_NAMES.ENEMIES,
                    frame: enemyJSONConfig.config.defaultFrame,
                    buttons: inputController.getNewButtons()
                }, enemyJSONConfig);

                enemy.setName(enemyName);

                this.setAIEnemy(enemy);

                if (enemyName === ENEMY_NAMES.BAT || enemyName === ENEMY_NAMES.BAT_BLUE)
                {
                    enemy.damageBody.hitAndDie = true;
                }

                if (enemyName === ENEMY_NAMES.FISHMAN)
                {
                    enemy.addSecondaryWeapon(WEAPON_NAMES.FIREBALL);
                }

                if (enemyName === ENEMY_NAMES.DRAGON_HEAD)
                {
                    enemy.addSecondaryWeapon(WEAPON_NAMES.FIREBALL);
                    enemy.addSecondaryWeapon(WEAPON_NAMES.FIREBALL);

                    if (i % 2 === 0)
                    {
                        enemy.setFlipX(true);
                    }
                }

                if (enemyName === ENEMY_NAMES.BONE_DRAGON)
                {
                    enemy.addSecondaryWeapon(WEAPON_NAMES.FIREBALL);
                }

                if (enemyName === ENEMY_NAMES.SKELETON)
                {
                    enemy.addSecondaryWeapon(WEAPON_NAMES.BONE);
                    enemy.addSecondaryWeapon(WEAPON_NAMES.BONE);
                    enemy.addSecondaryWeapon(WEAPON_NAMES.BONE);
                }

                if (enemyName === ENEMY_NAMES.SKELETON_RED)
                {
                    enemy.body.setBoundsRectangle(this.scene.cameras.main.getBounds());
                }

                if (enemyName === ENEMY_NAMES.AXE_KNIGHT)
                {
                    enemy.addSecondaryWeapon(WEAPON_NAMES.AXE);
                }

                if (enemyName === ENEMY_NAMES.SPIKE)
                {
                    enemy.damageBody.oneShotEnemy = true;
                    enemy.damageBody.invincible = true;
                }

                const resurectEnemiesException: string[] = [ENEMY_NAMES.FISHMAN, ENEMY_NAMES.SKELETON_RED, ENEMY_NAMES.EAGLE]

                if (enemyJSONConfig.resurrect > 0 && !resurectEnemiesException.includes(enemyName))
                {
                    const player = this.scene.getPlayerByName(PLAYER_A_NAME);

                    const distance = Phaser.Math.Distance.BetweenPoints(enemy, player);

                    if (distance < 256)
                    {
                        enemy.killAndRespawn();
                    }
                }

                if(enemyName === ENEMY_NAMES.EAGLE && this.scene.isInsideCameraByPixels(enemy.body,16))
                {
                    enemy.killAndRespawn();
                }
            }
        });

        this.createEnemyColliders();
    }

    addBoss(bossName: string, bossObj: Phaser.Types.Tilemaps.TiledObject, bossJSONConfig: TEntityConfig)
    {
        const boss = new Boss({
            scene: this.scene,
            x: bossObj.x!,
            y: bossObj.y!,
            texture: ATLAS_NAMES.ENEMIES,
            frame: bossJSONConfig.config.defaultFrame,
            buttons: InputController.getInstance().getNewButtons()
        }, bossJSONConfig);

        boss.setName(bossName);

        if (bossName === ENEMY_NAMES.DEATH)
        {
            boss.addSecondaryWeapon(WEAPON_NAMES.SCYTHE);
            boss.addSecondaryWeapon(WEAPON_NAMES.SCYTHE);
            boss.addSecondaryWeapon(WEAPON_NAMES.SCYTHE);
        }

        if (bossName === ENEMY_NAMES.DRACULA)
        {
            boss.addSecondaryWeapon(WEAPON_NAMES.FIREBALL);
            boss.addSecondaryWeapon(WEAPON_NAMES.FIREBALL);
            boss.addSecondaryWeapon(WEAPON_NAMES.FIREBALL);

            boss.damageBody.hasCustomZoneHit = true;
            boss.damageBody.customZoneHit = [0, 10];
        }

        this.setAIEnemy(boss);
    }

    addFinalBoss(x: number, y: number)
    {
        // clear old fireballs
        this.scene.enemyWeaponGroup.clear();

        // destroy enemies related colliders
        this.destroyEnemyColliders();

        const bossJSONConfig: TEntityConfig = JSON.parse(JSON.stringify(enemyJSON[ENEMY_NAMES.DRACULA_2]));
        bossJSONConfig.status.position.x = x;
        bossJSONConfig.status.position.y = y;

        const boss = new Boss({
            scene: this.scene,
            x: x,
            y: y,
            texture: ATLAS_NAMES.ENEMIES,
            frame: bossJSONConfig.config.defaultFrame,
            buttons: InputController.getInstance().getNewButtons()
        }, bossJSONConfig);

        boss.setName(ENEMY_NAMES.DRACULA_2);

        boss.addSecondaryWeapon(WEAPON_NAMES.FIREBALL);
        boss.addSecondaryWeapon(WEAPON_NAMES.FIREBALL);
        boss.addSecondaryWeapon(WEAPON_NAMES.FIREBALL);

        this.setAIEnemy(boss);

        this.createEnemyColliders();
    }

    addDraculaHead(x: number, y: number, flipX: boolean)
    {
        const draculaHead = this.scene.add.sprite(x, y, ATLAS_NAMES.ENEMIES, 'dracula-head')
            .setActive(true)
            .setVisible(true)
            .setOrigin(0.5, 0.5)
            .setFlipX(flipX)
            .setDepth(DEPTH.PLAYER + 1);

        this.scene.add.existing(draculaHead);

        this.scene.physics.world.enable(draculaHead);

        const body = draculaHead.body as Phaser.Physics.Arcade.Body;

        body.setCircle(6).setBounce(0.5, 0.75).setCollideWorldBounds(true).setAllowRotation(true)
        body.angularVelocity = body.velocity.x;

        this.scene.physics.add.collider(draculaHead, this.scene.colliderLayer);

        if (flipX)
        {
            body.setVelocity(100, -30).setAngularVelocity(-100);
        }
        else
        {
            body.setVelocity(-100, -30).setAngularVelocity(100);
        }

        this.scene.time.addEvent({
            delay: 4000,
            callback: () =>
            {
                const childrenToExclude = [ENEMY_NAMES.DRACULA_2, 'back-moon', PLAYER_A_NAME, WEAPON_NAMES.DAGGER, WEAPON_NAMES.AXE, WEAPON_NAMES.HOLY_WATER, WEAPON_NAMES.CROSS];
                const world = this.scene.children.getAll().filter(elm => elm.name !== 'collideLayer'
                    && !elm.name.startsWith('ground')
                    && !childrenToExclude.includes(elm.name));

                const layers = [
                    ...LayerService.getBackgroundLayers(this.scene),
                    ...LayerService.getForegroundLayers(this.scene),
                    ...world
                ]

                this.scene.cameras.main.flash(1000);

                draculaHead.destroy();

                this.scene.tweens.add({
                    duration: 600,
                    targets: layers,
                    alpha: 0,
                    onComplete: () =>
                    {
                        this.addFinalBoss(x, y - HEIGHT);
                    }
                });
            }
        });
    }

    public createEnemyColliders()
    {
        this.enemiesDamageBody = this.scene.enemies.map(enemy => enemy.damageBody);

        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

        // enemies make damage to player
        this.enemiesVsPlayerCollider = this.scene.physics.add.overlap(player.damageBody, this.enemiesDamageBody, (_player, _enemy) =>
        {
            const playerDamageBody = _player as DamageBody;

            const enemyDamageBody = _enemy as DamageBody;

            if (enemyDamageBody.hitAndDie)
            {
                enemyDamageBody.parent.die();
            }

            let damage = Number(playerDamageBody.parent.status.stage.toString()[0].padStart(2, '0'));

            if (enemyDamageBody.oneShotEnemy)
            {
                damage = 16;
            }

            playerDamageBody.parent.stateMachine.transition(EPossibleState.HURT, playerDamageBody.parent.stateMachine.state);

            playerDamageBody.parent.setDamage(damage);
        }, (_player, _enemy) =>
        {
            const playerDamageBody = _player as DamageBody;

            const enemy = _enemy as DamageBody;

            if (playerDamageBody.parent.stateMachine.state === EPossibleState.HURT
                || playerDamageBody.parent.physicsProperties.isHurt
                || !enemy.parent.active
                || enemy.parent.visible === false
            )
            {
                return false;
            }

            return true;
        }, this).setName('enemiesVsPlayerCollider');

        this.enemiesSecondaryWeapons = this.scene.enemies.filter(enemy => enemy.active).map(enemy => enemy.secondaryWeaponGroup?.getChildren()).flat();
        // enemies weapons make damage to player
        this.enemiesWeaponsVsPlayerCollider = this.scene.physics.add.overlap(player.damageBody, this.enemiesSecondaryWeapons, (_player, _weapon) =>
        {
            const playerDamageBody = _player as DamageBody;

            const weapon = _weapon as unknown as Weapon;

            weapon.setDisable();

            const damage = Number(playerDamageBody.parent.status.stage.toString()[0].padStart(2, '0'));

            playerDamageBody.parent.stateMachine.transition(EPossibleState.HURT, playerDamageBody.parent.stateMachine.state);

            playerDamageBody.parent.setDamage(damage);
        }, (_player, _weapon) =>
        {
            const playerDamageBody = _player as DamageBody;

            if (playerDamageBody.parent.stateMachine.state === EPossibleState.HURT
                || playerDamageBody.parent.physicsProperties.isHurt
            )
            {
                return false;
            }

            return true;
        }, this).setName('enemiesWeaponsVsPlayerCollider');

        // player weapons make damage to enemy
        this.enemiesVsWeaponsCollider = this.scene.physics.add.overlap(this.scene.playersWeaponGroup, this.enemiesDamageBody, (_weapon, _enemy) =>
        {
            const damageBody = _enemy as DamageBody;

            const weapon = _weapon as unknown as Weapon;

            if (damageBody.invincible) return;

            if (!damageBody.parent.active && damageBody.parent.name === ENEMY_NAMES.FLEAMAN)
            {
                damageBody.parent.setActive(true).die();
            }

            if (damageBody.hasCustomZoneHit && !damageBody.checkZoneHit(weapon.body.center.y))
            {
                return;
            }

            damageBody.parent.setDamage(weapon.damage);

            if (damageBody.parent.status.health > 0 && weapon.name !== WEAPON_NAMES.AXE && weapon.name !== WEAPON_NAMES.HOLY_WATER)
            {
                const impact = this.scene.impactGroup?.get(damageBody.body.center.x, weapon.body.center.y);

                if (impact)
                {
                    impact.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => impact.setActive(false).setVisible(false));
                    impact.setDepth(DEPTH.FRONT_LAYER)
                        .setFlipX(damageBody.body.center.x > weapon.body.center.x ? false : true)
                        .setActive(true)
                        .setVisible(true)
                        .play('impact');
                }
            }

            if (damageBody.parent.status.health <= 0 && !BOSS_NAMES.includes(damageBody.parent.name))
            {
                this.dropRandomItem(damageBody.body.center, damageBody.parent);
            }

            this.scene.playSound(15, undefined, true);

            if ((weapon.canStun || damageBody.parent.config.stunWith?.includes(weapon.name))
                && damageBody.parent.status.health > 0
                && damageBody.parent.canUse(EPossibleState.STUN)
            )
            {
                damageBody.parent.stateMachine.transition(EPossibleState.STUN, damageBody.parent.stateMachine.state);
            }

            if (weapon instanceof ThrowingKnife)
            {
                weapon.setDisable();
            }

        }, undefined, this).setName('enemiesVsWeaponsCollider');

        // player weapons make destroy enemies weapons
        this.weaponGroupVsEnemiesSecondaryWeapons = this.scene.physics.add.overlap(this.scene.playersWeaponGroup, this.enemiesSecondaryWeapons, (_weapon, _enemyWeapon) =>
        {
            const enemyWeapon = _enemyWeapon as unknown as Weapon;
            enemyWeapon.setDisable();

            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            player.status.setScore(player.status.score + 100);

            const smoke = this.scene.smokeGroup.get(enemyWeapon.body.center.x, enemyWeapon.body.center.y);

            if (smoke)
            {
                smoke.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => smoke.setActive(false).setVisible(false));
                smoke.setDepth(DEPTH.FRONT_LAYER).setActive(true).setVisible(true).play('smoke');
            }

            this.dropRandomItem(enemyWeapon.body.center, enemyWeapon.parent);

        }, undefined, this).setName('weaponGroupVSenemiesSecondaryWeapons');
    }

    public destroyEnemyColliders()
    {
        // destroy enemies related colliders
        this.enemiesVsWeaponsCollider?.destroy();

        this.enemiesVsPlayerCollider?.destroy();

        this.enemiesWeaponsVsPlayerCollider?.destroy();

        this.weaponGroupVsEnemiesSecondaryWeapons?.destroy();
    }

    private dropRandomItem(center: Phaser.Math.Vector2, enemy: Entity)
    {
        const chance = Phaser.Math.RND.between(0, 100);

        switch (true)
        {
            case (chance > 20):
                return;
            case (chance > 10):
                // give little heart
                const heart = new AmmoRetrievableItem({ scene: this.scene, x: center.x, y: center.y, texture: ATLAS_NAMES.ITEMS, frame: 'little-heart', quantity: 1 });
                this.scene.itemsGroup.add(heart);
                this.setItemTimer(heart);
                return;
            case (chance > 5 && enemy.name !== ENEMY_NAMES.DRACULA):
                // give secondary weapon
                const weaponChoice = Phaser.Math.RND.integerInRange(1, 4);
                if (weaponChoice === 1)
                {
                    const dagger = new WeaponRetrievableItem({ scene: this.scene, x: center.x, y: center.y, texture: ATLAS_NAMES.ITEMS, frame: 'dagger', quantity: 1, name: 'dagger' })
                    this.scene.itemsGroup.add(dagger);
                    this.setItemTimer(dagger);
                }

                if (weaponChoice === 2)
                {
                    const axe = new WeaponRetrievableItem({ scene: this.scene, x: center.x, y: center.y, texture: ATLAS_NAMES.ITEMS, frame: 'axe', quantity: 1, name: 'axe' })
                    this.scene.itemsGroup.add(axe);
                    this.setItemTimer(axe);
                }

                if (weaponChoice === 3)
                {
                    const cross = new WeaponRetrievableItem({ scene: this.scene, x: center.x, y: center.y, texture: ATLAS_NAMES.ITEMS, frame: 'cross', quantity: 1, name: 'cross' })
                    this.scene.itemsGroup.add(cross);
                    this.setItemTimer(cross);
                }

                if (weaponChoice === 4)
                {
                    const holyWater = new WeaponRetrievableItem({ scene: this.scene, x: center.x, y: center.y, texture: ATLAS_NAMES.ITEMS, frame: 'holy-water', quantity: 1, name: 'holy-water' })
                    this.scene.itemsGroup.add(holyWater);
                    this.setItemTimer(holyWater);
                }
                return;
            case (chance > 0):
                // give double-shot
                if (this.scene.playersSecondaryWeaponGroup.getLength() === 0)
                {
                    const bigheart = new BigAmmoRetrievableItem({ scene: this.scene, x: center.x, y: center.y, texture: ATLAS_NAMES.ITEMS, frame: 'big-heart', quantity: 5 });
                    this.scene.itemsGroup.add(bigheart);
                    this.setItemTimer(bigheart);
                }
                else
                {
                    const player = this.scene.getPlayerByName(PLAYER_A_NAME) as Player;

                    if (player.multipleShots === 1)
                    {
                        const doubleShot = new BaseRetrievableItem({ scene: this.scene, x: center.x, y: center.y, texture: ATLAS_NAMES.ITEMS, frame: TILE_ITEMS.DOUBLE_SHOT, quantity: 1, name: TILE_ITEMS.DOUBLE_SHOT })
                        this.scene.itemsGroup.add(doubleShot);
                        this.setItemTimer(doubleShot);
                        break;
                    }

                    if (player.multipleShots === 2)
                    {
                        const tripleShot = new BaseRetrievableItem({ scene: this.scene, x: center.x, y: center.y, texture: ATLAS_NAMES.ITEMS, frame: 'triple-shot', quantity: 1, name: 'triple-shot' })
                        this.scene.itemsGroup.add(tripleShot);
                        this.setItemTimer(tripleShot);
                        break;
                    }
                }
        }
    }

    public addCustomEffects()
    {
        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

        if (player.status.stage === 11 && this.customEffects.get('rainEffect') === undefined)
        {
            const rainEffect = new RainEffect(this.scene);
            this.customEffects.set(rainEffect.name, rainEffect);
        }

        this.checkCustomStageEffect(player.status.stage);
    }

    public checkCustomStageEffect(stage: number)
    {
        if (stage === 11)
        {
            this.customEffects.get('rainEffect')?.start();
        }

        if (stage === 12)
        {
            const rain = this.customEffects.get('rainEffect');

            if (rain && rain instanceof RainEffect)
            {
                rain.setDepth(DEPTH.BACKGROUND_LAYER - 5);
            }
        }

        if (stage === 21)
        {
            this.customEffects.get('rainEffect')?.destroy();
        }
    }
}