// @ts-ignore
import animatedTilesPlugin from '../plugins/AnimatedTiles.js';
import { FONTS, FONTS_SIZES, HEIGHT, HUD_EVENTS_NAMES, PLAYER_A_NAME, SCENES_NAMES, STAGE_BACKTRACK, STAGE_START_POSITION, TILED_WORLD_OFFSET_Y, TILE_SIZE, WIDTH } from '../constant/config';
import { InputController } from '../inputs/InputController';
import LayerService from '../services/LayerService.js';
import { Entity } from '../entities/Entity.js';
import ColliderService from '../services/ColliderService.js';
import WorldRooms from '../utils/WorldRooms.js';
import { TCoord, TDoor } from '../types/types.js';
import SaveLoadService from '../services/SaveLoadService.js';
import { PALETTE_DB32 } from '../constant/colors.js';
import init from '../custom/init.js';
import addEnemies from '../custom/addEnemies.js';
import { EPossibleState } from '../constant/character.js';
import DamageBody from '../entities/DamageBody.js';
import ThrowingKnife from '../entities/weapons/ThrowingKnife.js';
import Weapon from '../entities/weapons/Weapon.js';
import { Orb } from '../gameobjects/Orb.js';
import creditsData from '../data/credits.json';
import { DEPTH } from '../constant/depth.js';

/**
 * @author © Philippe Pereira 2022
 * @export
 * @class GameScene
 * @extends {Scene}
 */
export default class GameScene extends Phaser.Scene
{
    public inputController: InputController;
    public map: Phaser.Tilemaps.Tilemap;
    public firstTimestamp: number = 0;
    public colliderLayer: Phaser.Tilemaps.TilemapLayer;
    public characters: Entity[] = [];
    public enemies: Entity[] = [];
    public enemiesDamageBody: DamageBody[] = [];
    public enemyDeathGroup: Phaser.GameObjects.Group;
    public enemiesVsWeaponsCollider: Phaser.Physics.Arcade.Collider;
    public enemiesVsPlayerCollider: Phaser.Physics.Arcade.Collider;
    public isTouchingDoor: boolean = false;
    public lightCandlesGroup: Phaser.GameObjects.Group;
    public movingPlatformGroup: Phaser.GameObjects.Group;
    public conveyorGroup: Phaser.GameObjects.Group;
    public itemsGroup: Phaser.GameObjects.Group;
    public weaponGroup: Phaser.GameObjects.Group;
    public secondaryWeaponGroup: Phaser.GameObjects.Group;
    public currentPlayingSong: Phaser.Sound.BaseSound | null;
    public musicIndex: number = 0;
    public enemyWeaponGroup: Phaser.GameObjects.Group;
    public enemiesWeaponsVsPlayerCollider: Phaser.Physics.Arcade.Collider;
    public weaponGroupVsEnemiesSecondaryWeapons: Phaser.Physics.Arcade.Collider;
    public enemiesSecondaryWeapons: Phaser.GameObjects.GameObject[];
    public isBossBattle: boolean = false;
    public isChangingStage: boolean = false;
    public isOrb: boolean = false;
    debugGraphics: Phaser.GameObjects.Graphics;

    constructor()
    {
        super({
            key: SCENES_NAMES.GAME,
            active: false,
            visible: false
        });
    }

    public init(data: any)
    {
        console.log('death here?');
        if (data?.retry === true)
        {
            this.characters.forEach(character => character.destroy());
            this.characters.length = 0;
        }
        // @ts-ignore
        // this.plugins.get('SceneWatcher').watchAll();
    }

    public preload()
    {
        this.input.enabled = false;
        this.input.keyboard ? this.input.keyboard.enabled = false : null;

        this.load.scenePlugin({
            key: 'animatedTilesPlugin',
            url: animatedTilesPlugin,
            sceneKey: 'animatedTile'
        });
    }

    public create()
    {
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

        this.inputController = InputController.getInstance(this);
        this.inputController.resetButtons();
        this.input.enabled = false;

        // initialize the map and tileset
        this.map = this.make.tilemap({ key: 'map1', tileWidth: 16, tileHeight: 16 });
        this.map.tilesets.forEach((tileset, i) =>
        {
            this.map.addTilesetImage(this.map.tilesets[i].name, this.map.tilesets[i].name, 16, 16, 1, 2);
        });

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
            .setBoundsCollision(true, true, true, true);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        // create groups
        this.createGroups();

        this.characters.forEach(character => character.destroy());
        this.characters.length = 0;

        // init custom data game
        init(this);

        LayerService.addLayers(this);

        ColliderService.addColliders(this);

        // initialize the time
        this.firstTimestamp = new Date().getTime();

        // starts animated tiles
        // @ts-ignore
        this.sys.animatedTilesPlugin.init(this.map);

        this.scene.stop(SCENES_NAMES.LOAD)
            .stop(SCENES_NAMES.MENU)
            .stop(SCENES_NAMES.GAMEOVER);

        this.cameras.main.setPosition(0, TILED_WORLD_OFFSET_Y)

        WorldRooms.generate(this);

        this.setCurrentStage();

        if (!this.scene.isActive(SCENES_NAMES.HUD))
        {
            this.scene.launch(SCENES_NAMES.HUD);
        }
        else
        {
            this.events.emit(HUD_EVENTS_NAMES.RESET);
        }

        this.events.emit(HUD_EVENTS_NAMES.BOSS_HEALTH, 16);

        this.cameraFollowPlayer();
    }

    public update(time: number, delta: number): void
    {

        if (this.inputController.playerAButtons.x.isDown)
        {
            if (this.debugGraphics && this.debugGraphics.commandBuffer.length)
            {
                this.debugGraphics.destroy();

                return;
            }

            this.debugGraphics = this.add.graphics().setDepth(2000);

            this.colliderLayer.renderDebug(this.debugGraphics, {
                tileColor: null, // Non-colliding tiles
                collidingTileColor: null, // new Phaser.Display.Color(243, 134, 48, 50), // Colliding tiles
                faceColor: new Phaser.Display.Color(227, 6, 6, 255) // Colliding face edges
            });
        }

        if (this.inputController.playerAButtons.y.isDown)
        {
            localStorage.removeItem(`Castlevania_data`);
        }

        if (this.inputController.playerAButtons.l1.isDown)
        {
            const status = { ...this.characters[0].status.toJson() };
            status.position.x = this.characters[0].x;
            status.position.y = this.characters[0].y;
            SaveLoadService.saveGameData(status);

        }
    }

    public shutdown()
    {

    }

    public playSound(sfxIndex: number, volume: number = 0.5, ignoreIfPlaying: boolean = false)
    {
        const snd = this.sound.get(`SFX${sfxIndex}`);

        if (snd && !ignoreIfPlaying)
        {
            snd.play({ volume: volume });

            return;
        }

        if (snd && ignoreIfPlaying && !snd.isPlaying)
        {
            snd.play({ volume: volume });

            return;
        }
        else if (!snd)
        {
            this.sound.add(`SFX${sfxIndex}`);

            this.sound.play(`SFX${sfxIndex}`, { volume: volume });
        }
    }

    public playSong(musicIndex: number, loop: boolean = true)
    {
        if (musicIndex && this.musicIndex !== musicIndex)
        {
            this.currentPlayingSong?.stop();

            this.musicIndex = musicIndex;

            this.currentPlayingSong = this.sound.get(musicIndex.toString());

            this.currentPlayingSong?.play({ loop });
        }
    }

    private createGroups(): void
    {
        this.conveyorGroup = this.add.group();

        this.movingPlatformGroup = this.add.group();

        this.itemsGroup = this.add.group();

        this.weaponGroup = this.add.group();

        this.secondaryWeaponGroup = this.add.group();
        this.secondaryWeaponGroup.maxSize = 3;

        this.enemyWeaponGroup = this.add.group();
        this.enemyWeaponGroup.maxSize = 10;

        this.lightCandlesGroup = this.add.group({
            classType: Phaser.GameObjects.PointLight,
            maxSize: 30,
        });

        this.enemyDeathGroup = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            maxSize: 20,
        });
    }

    public setCurrentStage()
    {
        this.time.addEvent({
            delay: 32,
            callback: () =>
            {
                const currentZone = this.getPlayerCurrentStage();

                const cameraBounds = this.cameras.main.getBounds();

                if (!currentZone) return;

                const { x, y, width, height } = currentZone;

                if (x !== cameraBounds.x
                    || y !== cameraBounds.y
                    || width !== cameraBounds.width
                    || height !== cameraBounds.height
                )
                {
                    this.setParallaxImagePosition(width!);

                    this.cameras.main.setBounds(x!, y!, width!, height!);

                    const zoneData = LayerService.convertTiledObjectProperties(currentZone.properties);

                    this.changeMajorStage(zoneData?.stage);

                    this.playSong(zoneData?.musicIndex);

                    LayerService.addCandlesPointLight(this);
                    LayerService.addMovingPlatforms(this);
                    LayerService.addConveyors(this);

                    if (zoneData?.stage === 71)
                    {
                        const backCastle = this.children.getByName('back-castle') as Phaser.GameObjects.Image;
                        backCastle.setAlpha(0);
                    }

                    addEnemies(this);

                    this.isChangingStage = false;
                }
            }
        })
    }

    private getPlayerCurrentStage()
    {
        const zones = LayerService.getObjectLayerByName(this, 'zone');

        const player = this.getPlayerByName(PLAYER_A_NAME);

        if (!zones) throw new Error(`no layer named zone found`);

        const { x, y } = player.body.center;

        return zones.objects.find(zone =>
        {
            const isX = x > zone.x! && x < zone.x! + zone.width!;

            const isY = y > zone.y! && y < zone.y! + zone.height!;

            return (isX && isY);
        });
    }

    public isInPlayerStage(gameObject: Entity | Phaser.Types.Tilemaps.TiledObject | TCoord): boolean
    {
        const currentZone = this.getPlayerCurrentStage();

        if (!currentZone) return false;

        const { x, y } = gameObject;

        const isX = x! >= currentZone.x! && x! <= currentZone.x! + currentZone.width!;

        const isY = y! >= currentZone.y! && y! <= currentZone.y! + currentZone.height!;

        return (isX && isY);
    }

    public getTileStage(tile: Phaser.Tilemaps.Tile): number | null
    {
        const { pixelX, pixelY } = tile;

        const stages = LayerService.getObjectLayerByName(this, 'zone');

        if (stages)
        {
            const tileStage = stages.objects.find(stage => pixelX! >= stage.x!
                && pixelX! < stage.x! + stage.width!
                && pixelY! >= stage.y!
                && pixelY! < stage.y! + stage.height!
            )
            const stageProperties = LayerService.convertTiledObjectProperties(tileStage?.properties);

            return stageProperties?.stage || null;
        }

        return null;
    }

    private canEnterStage(door: TDoor): boolean
    {
        const zones = LayerService.getObjectLayerByName(this, 'zone');

        if (!zones) throw new Error(`no layer named zone found`);

        const nextZone = zones.objects.find(zone =>
        {
            const isX = door.x >= zone.x! && door.x <= zone.x! + zone.width!;

            const isY = door.y >= zone.y! && door.y <= zone.y! + zone.height!;

            return (isX && isY);
        });

        if (!nextZone) return false;

        const nextZoneProperties = LayerService.convertTiledObjectProperties(nextZone.properties);

        const currentStage = LayerService.convertTiledObjectProperties(this.getPlayerCurrentStage()?.properties)?.stage;

        // check authorized backtraking
        if (STAGE_BACKTRACK.includes(nextZoneProperties?.stage) && nextZoneProperties?.stage + 1 === currentStage)
        {
            return true;
        }

        // check unauthorized backtracking
        if (nextZoneProperties?.stage < currentStage)
        {
            return false;
        }

        return true;
    }

    private changeMajorStage(zone: number)
    {
        const player = this.getPlayerByName(PLAYER_A_NAME);

        player.status.stage = zone;

        this.events.emit(HUD_EVENTS_NAMES.STAGE, zone);
    }

    public changeStage(nextDoor: TDoor)
    {
        if (this.canEnterStage(nextDoor) === false)
        {
            console.warn('zone already visited'.toUpperCase());

            return;
        }

        console.warn('changing zone'.toUpperCase());
        const player = this.getPlayerByName(PLAYER_A_NAME);

        if (!player) throw new Error("No player found");

        switch (nextDoor.side)
        {
            case 'left':
                player.body.reset(nextDoor.x - player.body.width / 2, nextDoor.y);
                break;
            case 'right':
                player.body.reset(nextDoor.x + TILE_SIZE + player.body.width / 2, nextDoor.y);
                break;
            case 'top':
                player.body.reset(nextDoor.x + player.body.halfWidth, nextDoor.y - 48);
                break;
            case 'bottom':
                player.body.reset(nextDoor.x + player.body.halfWidth, nextDoor.y + 32);
                break;
        }

        this.setCurrentStage();

        if (!player.physicsProperties.isDead && player.status.health > 0 && (player.status.life ?? 1) > 0)
        {
            player.status.setPosition({ x: player.x, y: player.y });

            SaveLoadService.saveGameData(player.status.toJson());
        }
    }

    public endStage()
    {
        const orb = this.children.getByName('orb') as Orb;

        orb?.body.setEnable(false);

        orb.setActive(false).setVisible(false);

        const player = this.getPlayerByName(PLAYER_A_NAME);

        this.playSong(10, false);
        this.currentPlayingSong?.once(Phaser.Sound.Events.COMPLETE, () =>
        {
            orb?.destroy();

            const timer = this.time.addEvent({
                delay: 100,
                repeat: player.status.ammo,
                callback: () =>
                {
                    if (timer.getRepeatCount() > 0)
                    {
                        this.playSound(5);

                        player.status.setAmmo(player.status.ammo - 1);

                        player.status.setScore(player.status.score + 100);
                    }

                    if (timer.getRepeatCount() === 0)
                    {
                        this.playSound(4);

                        this.isBossBattle = false;

                        this.nextStage();
                    }
                }
            });
        });
    }

    public endGame()
    {
        const orb = this.children.getByName('orb') as Orb;

        orb?.body.setEnable(false);

        orb.setActive(false).setVisible(false);

        const player = this.getPlayerByName(PLAYER_A_NAME);

        this.playSong(11, false);
        this.currentPlayingSong?.once(Phaser.Sound.Events.COMPLETE, () =>
        {
            orb?.destroy();

            const timer = this.time.addEvent({
                delay: 100,
                repeat: player.status.ammo,
                callback: () =>
                {
                    if (timer.getRepeatCount() > 0)
                    {
                        this.playSound(5);

                        player.status.setAmmo(player.status.ammo - 1);

                        player.status.setScore(player.status.score + 100);
                    }

                    if (timer.getRepeatCount() === 0)
                    {
                        this.playSound(4);

                        this.isBossBattle = false;

                        this.showCastleDestruction();
                    }
                }
            });
        });
    }

    private showCastleDestruction()
    {
        this.cameras.main.fadeOut(1000);
        this.time.addEvent({
            delay: 1000,
            callback: () =>
            {
                this.getPlayerByName(PLAYER_A_NAME).setActive(false).setVisible(false);

                LayerService.getGroundLayers(this).forEach(layer => layer.setAlpha(0));

                const mountains = this.children.getByName('parallax-mountain') as Phaser.GameObjects.TileSprite;
                mountains.setAlpha(1).setPosition(-64, 16);

                const castle = this.children.getByName('back-castle') as Phaser.GameObjects.Image;
                castle.setAlpha(1).setOrigin(0.5, 0).setPosition(184, -8).setScrollFactor(0, 0);

                this.cameras.main.fadeIn(1000);

                this.tweens.add({
                    targets: castle,
                    delay: 2000,
                    duration: 8000,
                    y: 256,
                    angle: -30,
                    onUpdate: () =>
                    {
                        this.playSound(33, 0.5, true);
                        this.cameras.main.shake(50, 0.01, false)
                    },
                    onComplete: () =>
                    {
                        this.playSong(13, false);

                        this.showCredits();
                    }
                })
            }
        });
    }

    private showCredits()
    {
        const crediText = this.add.bitmapText(WIDTH / 2, HEIGHT / 2, FONTS.GALAXY, '', FONTS_SIZES.GALAXY, 1)
            .setScrollFactor(0, 0)
            .setOrigin(0.5, 0.5)
            .setDepth(DEPTH.FRONT_LAYER)
            .setTintFill(PALETTE_DB32.HOT_CINNAMON);

        const titles = Object.keys(creditsData.credits);

        const creditTimer = this.time.addEvent({
            startAt: 51000 / titles.length - 1,
            delay: 51000 / titles.length - 1,
            repeat: titles.length,
            callback: () =>
            {
                const count = titles.length - creditTimer.getRepeatCount();

                if (count < titles.length)
                {
                    const title: string = titles[count].replace(/_+/g, ' ').toLowerCase();

                    if (title === 'your score')
                    {
                        const content = `score: ${this.getPlayerByName(PLAYER_A_NAME).status.score}\ndeath: ${SaveLoadService.getPlayerDeathCount()}\nenemies killed: ${SaveLoadService.getEnemiesDeathCount()}\ntime: ${SaveLoadService.getSavedGameTimeToString()}`;

                        crediText.setText(`${title}\n${content}`).setLeftAlign();

                        return;
                    }

                    const content: string = creditsData.credits[titles[count]].join('\n ').toLowerCase()

                    crediText.setText(`${title}\n${content}`).setOrigin(0.5, 0.5).setCenterAlign();
                }
            }
        });

    }

    private nextStage()
    {
        this.isChangingStage = true;

        const player = this.getPlayerByName(PLAYER_A_NAME);

        player.status.setHealth(16).setAmmo(5);

        this.isOrb = false;

        this.events.emit(HUD_EVENTS_NAMES.BOSS_HEALTH, 16);

        this.cameras.main.removeBounds().fadeOut(10);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        switch (player.status.stage)
        {
            case 15:
                player.status.setPosition(STAGE_START_POSITION[21]).setStage(21);
                player.setFlipX(false);

                player.body.reset(STAGE_START_POSITION[21].x, STAGE_START_POSITION[21].y);

                break;

            case 26:
                player.status.setPosition(STAGE_START_POSITION[31]).setStage(31);
                player.setFlipX(true);

                player.body.reset(STAGE_START_POSITION[31].x, STAGE_START_POSITION[31].y);

                break;

            case 35:
                player.status.setPosition(STAGE_START_POSITION[41]).setStage(41);
                player.setFlipX(false);

                player.body.reset(STAGE_START_POSITION[41].x, STAGE_START_POSITION[41].y);

                break;

            case 44:
                player.status.setPosition(STAGE_START_POSITION[51]).setStage(51)
                player.setFlipX(false);

                player.body.reset(STAGE_START_POSITION[51].x, STAGE_START_POSITION[51].y);

                break;

            case 56:
                player.status.setPosition(STAGE_START_POSITION[61]).setStage(61)
                player.setFlipX(true);

                player.body.reset(STAGE_START_POSITION[61].x, STAGE_START_POSITION[61].y);

                break;

            default:
                break;
        }

        SaveLoadService.saveGameData(player.status.toJson());

        this.time.addEvent({
            delay: 1000,
            callback: () =>
            {
                this.setCurrentStage();
                this.cameras.main.fadeIn(200);
            }
        })
    }

    private cleanupBossBattle()
    {
        const currentZone = this.getPlayerCurrentStage();

        if (!currentZone) return;

        const { x, y, width, height } = currentZone;

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
            .setBoundsCollision(true, true, true, true);

        this.cameras.main.setBounds(x!, y!, width!, height!);
    }

    private setParallaxImagePosition(width: number)
    {
        // const backParallax = this.children.getByName('parallax-mountain') as Phaser.GameObjects.TileSprite;
    }
    public cameraFollowPlayer(): Phaser.Cameras.Scene2D.Camera
    {
        this.cameras.main.startFollow(this.getPlayerByName(PLAYER_A_NAME), true, 0.2, 0.1, 0, 0)
            .setDeadzone(4, 32)
            .setRoundPixels(true)
            .setBackgroundColor(PALETTE_DB32.BLACK);

        return this.cameras.main;
    }

    public getPlayerByName(playerName: string): Entity
    {
        const player = this.children.getByName(playerName);

        if (player === null) throw new Error(`no player named ${playerName} found`);

        return player as Entity;
    }

    public createEnemyColliders()
    {
        this.enemiesDamageBody = this.enemies.map(enemy => enemy.damageBody);

        const player = this.getPlayerByName(PLAYER_A_NAME);

        // enemies make damage to player
        this.enemiesVsPlayerCollider = this.physics.add.overlap(player.damageBody, this.enemiesDamageBody, (_player, _enemy) =>
        {
            const playerDamageBody = _player as DamageBody;

            const enemyDamageBody = _enemy as DamageBody;

            if (enemyDamageBody.parent.name === 'bat')
            {
                enemyDamageBody.parent.die();
            }

            let damage = Number(playerDamageBody.parent.status.stage.toString()[0].padStart(2, '0'));

            if (enemyDamageBody.parent.name === 'spike')
            {
                damage = 16;
            }

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
        }, this).setName('enemiesVsPlayerCollider');

        this.enemiesSecondaryWeapons = this.enemies.filter(enemy => enemy.active).map(enemy => enemy.secondaryWeaponGroup?.getChildren()).flat();
        // enemies weapons make damage to player
        this.enemiesWeaponsVsPlayerCollider = this.physics.add.overlap(player.damageBody, this.enemiesSecondaryWeapons, (_player, _weapon) =>
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
        }, this).setName('enemiesWeaponsVsPlayerCollider');

        // player weapons make damage to enemy
        this.enemiesVsWeaponsCollider = this.physics.add.overlap(this.weaponGroup, this.enemiesDamageBody, (_weapon, _enemy) =>
        {
            const enemy = _enemy as DamageBody;

            const weapon = _weapon as unknown as Weapon;

            if (enemy.parent.name === 'spike') return;

            if (enemy.parent.name === 'dracula')
            {
                if (weapon.body.center.y < 155 || weapon.body.center.y > 165)
                {
                    return;
                }
            }

            enemy.parent.setStatusHealthDamage(weapon.damage);

            this.playSound(15, undefined, true);

            if ((weapon.name === 'holyWater' || enemy.parent.config.stunWith?.includes(weapon.name))
                && enemy.parent.status.health > 0
                && enemy.parent.canUse(EPossibleState.STUN)
            )
            {
                enemy.parent.stateMachine.transition(EPossibleState.STUN, enemy.parent.stateMachine.state);
            }

            if (weapon instanceof ThrowingKnife)
            {
                weapon.setDisable();
            }

        }, undefined, this).setName('enemiesVsWeaponsCollider');

        // player weapons make destroy enemies weapons
        this.weaponGroupVsEnemiesSecondaryWeapons = this.physics.add.overlap(this.weaponGroup, this.enemiesSecondaryWeapons, (_weapon, _enemyWeapon) =>
        {
            const enemyWeapon = _enemyWeapon as unknown as Weapon;
            enemyWeapon.setDisable();

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

    public addOrb()
    {
        if (this.isOrb) return;

        this.isOrb = true;

        this.time.addEvent({
            delay: 1000,
            callback: () =>
            {
                const cam = this.cameras.main;

                const orb = new Orb({ scene: this, x: cam.worldView.centerX, y: cam.worldView.centerY - 64, texture: 'items', frame: 'magic-crystal_0' });

                this.itemsGroup.add(orb);
            }
        });
    }

    public isInsideCameraByPixels(body: Phaser.Physics.Arcade.Body, offset: number = 128): boolean
    {
        const cam = this.cameras.main;

        return body.right < cam.worldView.right + offset && body.left > cam.worldView.left - offset
    }
}