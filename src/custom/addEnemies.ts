import { Enemy } from "../entities/enemies/Enemy";
import { InputController } from "../inputs/InputController";
import GameScene from "../scenes/GameScene";
import LayerService from "../services/LayerService";
import enemyJSON from '../data/enemy.json';
import { PLAYER_A_NAME } from "../constant/config";
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


export default function addEnemies(scene: GameScene)
{
    // destroy enemies related colliders
    scene.destroyEnemyColliders();

    // destroy old zone enemies
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
    // scene.enemies.length = 0;
    // scene.enemiesDamageBody.length = 0;

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

    setAIEnemy(boss);
}