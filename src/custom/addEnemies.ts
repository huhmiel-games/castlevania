import { Enemy } from "../entities/enemies/Enemy";
import { InputController } from "../inputs/InputController";
import GameScene from "../scenes/GameScene";
import LayerService from "../services/LayerService";
import enemyJSON from '../data/enemy.json';
import DamageBody from "../entities/DamageBody";
import Weapon from "../entities/weapons/Weapon";
import { PLAYER_A_NAME } from "../constant/config";
import { EPossibleState } from "../constant/character";
import ThrowingKnife from "../entities/weapons/ThrowingKnife";
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


export default function addEnemies(scene: GameScene)
{
    // destroy enemies related colliders
    scene.enemiesVsWeaponsCollider?.destroy();

    scene.enemiesVsPlayerCollider?.destroy();

    scene.enemiesWeaponsVsPlayerCollider?.destroy();

    scene.weaponGroupVsEnemiesSecondaryWeapons?.destroy();

    // destroy old zone enemies
    scene.enemies.forEach(enemy =>
    {
        scene.children.remove(enemy.damageBody);
        scene.children.remove(enemy);
    });
    scene.enemies.length = 0;

    // create zone enemies
    const enemyLayer = LayerService.getObjectLayerByName(scene, 'enemies');

    const inputController = InputController.getInstance();

    enemyLayer?.objects.forEach((enemyObj, i) =>
    {
        if (scene.isInPlayerStage(enemyObj))
        {
            const enemyName: string = LayerService.convertTiledObjectProperties(enemyObj.properties)?.name;

            const enemyJSONConfig = JSON.parse(JSON.stringify(enemyJSON[enemyName]));
            enemyJSONConfig.status.position.x = enemyObj.x!;
            enemyJSONConfig.status.position.y = enemyObj.y!;

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

            const resurectEnemiesException = ['fishman', 'skeleton-red']

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

    const enemiesDamageBody = scene.enemies.map(enemy => enemy.damageBody);

    const player = scene.getPlayerByName(PLAYER_A_NAME);



    // enemies make damage to player
    scene.enemiesVsPlayerCollider = scene.physics.add.overlap(player.damageBody, enemiesDamageBody, (_player, _enemy) =>
    {
        const playerDamageBody = _player as DamageBody;

        const enemyDamageBody = _enemy as DamageBody;

        if (enemyDamageBody.parent.name === 'bat')
        {
            enemyDamageBody.parent.die();
        }

        const damage = Number(playerDamageBody.parent.status.stage.toString()[0].padStart(2, '0'));

        playerDamageBody.parent.stateMachine.transition(EPossibleState.HURT, playerDamageBody.parent.stateMachine.state);

        playerDamageBody.parent.setStatusHealthDamage(damage);
    }, (_player, _enemy) =>
    {
        const playerDamageBody = _player as DamageBody;

        const enemy = _enemy as DamageBody;

        if (enemy.parent.visible === false)
        {
            return false;
        }

        if (playerDamageBody.parent.stateMachine.state === EPossibleState.HURT
            || playerDamageBody.parent.physicsProperties.isHurt
            || !enemy.parent.active
        )
        {
            return false;
        }

        return true;
    }, scene).setName('enemiesVsPlayerCollider');

    const enemiesSecondaryWeapons = scene.enemies.filter(enemy => enemy.active).map(enemy => enemy.secondaryWeaponGroup?.getChildren()).flat();
    // enemies weapons make damage to player
    scene.enemiesWeaponsVsPlayerCollider = scene.physics.add.overlap(player.damageBody, enemiesSecondaryWeapons, (_player, _weapon) =>
    {
        const playerDamageBody = _player as DamageBody;

        const weapon = _weapon as unknown as Weapon;

        weapon.setDisable();

        const damage = Number(playerDamageBody.parent.status.stage.toString()[0].padStart(2, '0'));

        playerDamageBody.parent.stateMachine.transition(EPossibleState.HURT, playerDamageBody.parent.stateMachine.state);

        playerDamageBody.parent.setStatusHealthDamage(damage);
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
    }, scene).setName('enemiesWeaponsVsPlayerCollider');

    // player weapons make damage to enemy
    scene.enemiesVsWeaponsCollider = scene.physics.add.overlap(scene.weaponGroup, enemiesDamageBody, (_weapon, _enemy) =>
    {
        const enemy = _enemy as DamageBody;

        const weapon = _weapon as unknown as Weapon;

        enemy.parent.setStatusHealthDamage(weapon.damage);

        scene.playSound(15, undefined, true);

        if (weapon.name === 'holyWater' && enemy.parent.status.health > 0 && enemy.parent.canUse(EPossibleState.STUN))
        {
            enemy.parent.stateMachine.transition(EPossibleState.STUN, enemy.parent.stateMachine.state);
        }

        if (weapon instanceof ThrowingKnife)
        {
            weapon.setDisable();
        }

    }, undefined, scene).setName('enemiesVsWeaponsCollider');

    // player weapons make destroy enemies weapons
    scene.weaponGroupVsEnemiesSecondaryWeapons = scene.physics.add.overlap(scene.weaponGroup, enemiesSecondaryWeapons, (_weapon, _enemyWeapon) =>
    {
        const enemyWeapon = _enemyWeapon as unknown as Weapon;
        enemyWeapon.setDisable();

    }, undefined, scene).setName('weaponGroupVSenemiesSecondaryWeapons');
}

function setAIEnemy(enemy: Enemy)
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
        case 'skeleton-red':
            enemy.setAi(new SkeletonRedIA(enemy));
            break;
        case 'fleaman':
            enemy.setAi(new FleamanIA(enemy));
            break;
        case 'axe-knight':
            enemy.setAi(new AxeKnightIA(enemy));
            break;

        default:
            break;
    }
}