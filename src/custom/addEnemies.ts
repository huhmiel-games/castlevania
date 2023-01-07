import { Enemy } from "../entities/enemies/Enemy";
import { InputController } from "../inputs/InputController";
import GameScene from "../scenes/GameScene";
import LayerService from "../services/LayerService";
import enemyJSON from '../data/enemy.json';
import { HEIGHT, PLAYER_A_NAME } from "../constant/config";
import { ZombieIA } from "./enemies_ia/ZombieIA";
import { BatIA } from "./enemies_ia/BatIA";
import { MedusaIA } from "./enemies_ia/MedusaIA";
import { SpearKnightIA } from "./enemies_ia/SpearKnightIA";
import { CatIA } from "./enemies_ia/CatIA";
import { FishmanIA } from "./enemies_ia/FishmanIA";
import { GhostIA } from "./enemies_ia/GhostIA";
import { DragonHeadIA } from "./enemies_ia/DragonHeadIA";
import { SkeletonIA } from "./enemies_ia/SkeletonIA";
import { SkeletonRedIA } from "./enemies_ia/SkeletonRedIA";
import { FleamanIA } from "./enemies_ia/FleamanIA";
import { AxeKnightIA } from "./enemies_ia/AxeKnightIA";
import { BatBlueIA } from "./enemies_ia/BatBlueIA";
import { RavenIA } from "./enemies_ia/RavenIA";
import { EagleIA } from "./enemies_ia/EagleIA";
import { BoneDragonIA } from "./enemies_ia/BoneDragonIA";
import { MovingSpikeIA } from "./enemies_ia/MovingSpikeIA";
import { bossNames } from "../constant/character";
import { TEntityConfig } from "../types/types";
import { Boss } from "../entities/enemies/Boss";
import { GiantBatIA } from "./boss_ia/GiantBatIA";
import { MedusaBossIA } from "./boss_ia/MedusaBossIA";
import { MummyIA } from "./boss_ia/MummyIA";
import { FrankIA } from "./boss_ia/FrankIA";
import { IgorIA } from "./boss_ia/IgorIA";
import { DeathIA } from "./boss_ia/DeathIA";
import { GiantBatBridgeIA } from "./enemies_ia/GiantBatBridgeIA";
import { DraculaIA } from "./boss_ia/DraculaIA";
import { Dracula2IA } from "./boss_ia/Dracula2IA";
import { DEPTH } from "../constant/depth";
import Weapon from "../entities/weapons/Weapon";


export default function addEnemies(scene: GameScene)
{
    // destroy enemies related colliders
    scene.destroyEnemyColliders();

    // destroy old zone enemies
    for (let i = 0; i < scene.enemies.length; i += 1)
    {
        const enemy = scene.enemies[i];
        scene.enemies[i].destroy();
        scene.enemies.splice(i, 1);
        scene.children.remove(enemy.damageBody);
        scene.children.remove(enemy);
        if (enemy.name === 'spike')
        {
            const screw = scene.children.getByName('spikeScrew');

            if (screw)
            {
                scene.children.remove(screw);
            }
        }

        enemy.kill();
    }
    scene.enemies.forEach((enemy) =>
    {
        enemy.destroy();
        scene.children.remove(enemy.damageBody);
        scene.children.remove(enemy);
        if (enemy.name === 'spike')
        {
            const screw = scene.children.getByName('spikeScrew');

            if (screw)
            {
                scene.children.remove(screw);
            }
        }

        enemy.kill();
    });

    scene.enemyWeaponGroup.clear(true);

    // create zone enemies
    const enemyLayer = LayerService.getObjectLayerByName(scene, 'enemies');

    const inputController = InputController.getInstance();

    enemyLayer?.objects.forEach((enemyObj, i) =>
    {
        if (scene.isInPlayerStage(enemyObj))
        {
            const enemyName: string = LayerService.convertTiledObjectProperties(enemyObj.properties)?.name;

            const enemyJSONConfig: TEntityConfig = JSON.parse(JSON.stringify(enemyJSON[enemyName]));
            enemyJSONConfig.status.position.x = enemyObj.x!;
            enemyJSONConfig.status.position.y = enemyObj.y!;

            if (bossNames.includes(enemyName))
            {
                addBoss(scene, enemyName, enemyObj, enemyJSONConfig);

                return
            }

            const enemy = new Enemy({
                scene: scene,
                x: enemyObj.x!,
                y: enemyObj.y!,
                texture: 'enemies',
                frame: enemyJSONConfig.config.defaultFrame,
                buttons: inputController.getNewButtons()
            }, enemyJSONConfig);

            enemy.setName(enemyName);

            setAIEnemy(enemy);

            if (enemyName === 'fishman')
            {
                enemy.addSecondaryWeapon('fireball');
            }

            if (enemyName === 'dragonhead')
            {
                enemy.addSecondaryWeapon('fireball');
                enemy.addSecondaryWeapon('fireball');

                if (i % 2 === 0)
                {
                    enemy.setFlipX(true);
                }
            }

            if (enemyName === 'bone-dragon')
            {
                enemy.addSecondaryWeapon('fireball');
            }

            if (enemyName === 'skeleton')
            {
                enemy.addSecondaryWeapon('bone');
                enemy.addSecondaryWeapon('bone');
                enemy.addSecondaryWeapon('bone');
            }

            if (enemyName === 'skeleton-red')
            {
                enemy.body.setBoundsRectangle(scene.cameras.main.getBounds());
            }

            if (enemyName === 'axe-knight')
            {
                enemy.addSecondaryWeapon('axe');
            }

            const resurectEnemiesException = ['fishman', 'skeleton-red', 'eagle']

            if (enemyJSONConfig.resurrect > 0 && !resurectEnemiesException.includes(enemyName))
            {
                const player = scene.getPlayerByName(PLAYER_A_NAME);

                const distance = Phaser.Math.Distance.BetweenPoints(enemy, player);

                if (distance < 256)
                {
                    enemy.killAndRespawn();
                }
            }
        }
    });

    scene.createEnemyColliders();
}

function setAIEnemy(enemy: Enemy | Boss)
{
    switch (enemy.name)
    {
        case 'zombie':
            enemy.setAi(new ZombieIA(enemy));
            break;
        case 'bat':
            enemy.setAi(new BatIA(enemy));
            break;
        case 'bat-blue':
            enemy.setAi(new BatBlueIA(enemy));
            break;
        case 'medusa':
            enemy.setAi(new MedusaIA(enemy));
            break;
        case 'spear-knight':
            enemy.setAi(new SpearKnightIA(enemy));
            break;
        case 'cat':
            enemy.setAi(new CatIA(enemy));
            break;
        case 'fishman':
            enemy.setAi(new FishmanIA(enemy));
            break;
        case 'ghost':
            enemy.setAi(new GhostIA(enemy));
            break;
        case 'dragonhead':
            enemy.setAi(new DragonHeadIA(enemy));
            break;
        case 'skeleton':
            enemy.setAi(new SkeletonIA(enemy));
            break;
        case 'raven':
            enemy.setAi(new RavenIA(enemy));
            break;
        case 'eagle':
            enemy.setAi(new EagleIA(enemy));
            break;
        case 'bone-dragon':
            enemy.setAi(new BoneDragonIA(enemy));
            break;
        case 'skeleton-red':
            enemy.setAi(new SkeletonRedIA(enemy));
            break;
        case 'fleaman':
            enemy.setAi(new FleamanIA(enemy));
            break;
        case 'axe-knight':
            enemy.setAi(new AxeKnightIA(enemy));
            break;
        case 'spike':
            enemy.setAi(new MovingSpikeIA(enemy));
            break;
        case 'giant-bat':
            enemy.setAi(new GiantBatIA(enemy as Boss));
            break;
        case 'medusa-boss':
            enemy.setAi(new MedusaBossIA(enemy as Boss));
            break;
        case 'mummy':
            enemy.setAi(new MummyIA(enemy as Boss));
            break;
        case 'frank':
            enemy.setAi(new FrankIA(enemy as Boss));
            break;
        case 'igor':
            enemy.setAi(new IgorIA(enemy as Boss));
            break;
        case 'death':
            enemy.setAi(new DeathIA(enemy as Boss));
            break;
        case 'bat-bridge':
            enemy.setAi(new GiantBatBridgeIA(enemy as Enemy));
            break;
        case 'dracula':
            enemy.setAi(new DraculaIA(enemy as Boss));
            break;
        case 'dracula2':
            enemy.setAi(new Dracula2IA(enemy as Boss));
            break;

        default:
            break;
    }
}

function addBoss(scene: GameScene, bossName: string, bossObj: Phaser.Types.Tilemaps.TiledObject, bossJSONConfig: TEntityConfig)
{
    const boss = new Boss({
        scene: scene,
        x: bossObj.x!,
        y: bossObj.y!,
        texture: 'enemies',
        frame: bossJSONConfig.config.defaultFrame,
        buttons: InputController.getInstance().getNewButtons()
    }, bossJSONConfig);

    boss.setName(bossName);

    if (bossName === 'death')
    {
        boss.addSecondaryWeapon('scythe');
        boss.addSecondaryWeapon('scythe');
        boss.addSecondaryWeapon('scythe');
    }

    if (bossName === 'dracula')
    {
        boss.addSecondaryWeapon('fireball');
        boss.addSecondaryWeapon('fireball');
        boss.addSecondaryWeapon('fireball');
    }

    setAIEnemy(boss);
}

export function addFinalBoss(scene: GameScene, x: number, y: number)
{
    // clear old fireballs
    scene.enemyWeaponGroup.clear();

    // destroy enemies related colliders
    scene.destroyEnemyColliders();
    
    const bossJSONConfig: TEntityConfig = JSON.parse(JSON.stringify(enemyJSON['dracula2']));
    bossJSONConfig.status.position.x = x;
    bossJSONConfig.status.position.y = y;

    const boss = new Boss({
        scene: scene,
        x: x,
        y: y,
        texture: 'enemies',
        frame: bossJSONConfig.config.defaultFrame,
        buttons: InputController.getInstance().getNewButtons()
    }, bossJSONConfig);

    boss.setName('dracula2');

    boss.addSecondaryWeapon('fireball');
    boss.addSecondaryWeapon('fireball');
    boss.addSecondaryWeapon('fireball');

    setAIEnemy(boss);

    scene.createEnemyColliders();
}

export function addDraculaHead(scene: GameScene, x: number, y: number, flipX: boolean)
{
    const draculaHead = scene.add.sprite(x, y, 'enemies', 'dracula-head')
        .setActive(true)
        .setVisible(true)
        .setOrigin(0.5, 0.5)
        .setFlipX(flipX)
        .setDepth(DEPTH.PLAYER + 1);

    scene.add.existing(draculaHead);

    scene.physics.world.enable(draculaHead);

    const body = draculaHead.body as Phaser.Physics.Arcade.Body;

    body.setCircle(6).setBounce(0.5, 0.75).setCollideWorldBounds(true).setAllowRotation(true)
    body.angularVelocity = body.velocity.x;

    scene.physics.add.collider(draculaHead, scene.colliderLayer);

    if (flipX)
    {
        body.setVelocity(100, -30).setAngularVelocity(-100);
    }
    else
    {
        body.setVelocity(-100, -30).setAngularVelocity(100);
    }

    scene.time.addEvent({
        delay: 4000,
        callback: () =>
        {
            const childrenToExclude = ['dracula2', 'back-moon', PLAYER_A_NAME, 'dagger', 'axe', 'holyWater', 'cross'];
            const world = scene.children.getAll().filter(elm => elm.name !== 'collideLayer' 
            && !elm.name.startsWith('ground')
            && !childrenToExclude.includes(elm.name));

            const layers = [
                // ...LayerService.getGroundLayers(scene).filter(elm => elm.name !== 'candle'),
            ...LayerService.getBackgroundLayers(scene),
            ...LayerService.getForegroundLayers(scene),
            ...world
            ]

            scene.cameras.main.flash(1000) //, 67.5, 19.6, 19.6);

            draculaHead.destroy();

            scene.tweens.add({
                duration: 600,
                targets: layers,
                alpha: 0,
                onComplete: () => {
                    addFinalBoss(scene, x, y - HEIGHT);
                }
            });
        }
    });
}