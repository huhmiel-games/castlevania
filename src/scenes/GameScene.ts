// @ts-ignore
import animatedTilesPlugin from '../plugins/AnimatedTiles.js';
import
{
    ATLAS_NAMES,
    BTN_EVENTS,
    COUNTDOWN_EVENT, FONTS, FONTS_SIZES,
    HEIGHT, HUD_EVENTS_NAMES, isDev, PLAYERS_NAMES,
    SCENES_NAMES, STAGE_BACKTRACK, STAGE_COUNTDOWN,
    STAGE_START_POSITION, TILED_WORLD_OFFSET_Y, TILE_SIZE, WIDTH
} from '../constant/config';
import { InputController } from '../inputs/InputController';
import LayerService from '../services/LayerService.js';
import { Entity } from '../entities/Entity.js';
import ColliderService from '../services/ColliderService.js';
import WorldRooms from '../utils/WorldRooms.js';
import { TCoord, TDoor } from '../types/types.js';
import SaveLoadService from '../services/SaveLoadService.js';
import { PALETTE_DB32 } from '../constant/colors.js';
import { Orb } from '../gameobjects/Orb.js';
import creditsData from '../data/credits.json';
import { DEPTH } from '../constant/depth.js';
import { StageCountDown } from '../utils/StageCountDown.js';
import { CustomeGame } from '../custom/CustomGame.js';
import { warn } from '../utils/log.js';
import DamageBody from '../entities/DamageBody.js';

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
    public customGame: CustomeGame;
    public colliderLayer: Phaser.Tilemaps.TilemapLayer;
    public characters: Entity[] = [];
    public enemies: Entity[] = [];
    public enemyDeathGroup: Phaser.GameObjects.Group;
    public isTouchingDoor: boolean = false;
    public lightItemsGroup: Phaser.GameObjects.Group;
    public movingPlatformGroup: Phaser.GameObjects.Group;
    public conveyorGroup: Phaser.GameObjects.Group;
    public itemsGroup: Phaser.GameObjects.Group;
    public playersWeaponGroup: Phaser.GameObjects.Group;
    public currentPlayingSong: Phaser.Sound.BaseSound | null;
    public musicIndex: number = 0;
    public enemyWeaponGroup: Phaser.GameObjects.Group;
    public isBossBattle: boolean = false;
    public isChangingStage: boolean = false;
    public stageCountdown = new StageCountDown(this);
    public isPaused: boolean = false;

    debugGraphics: Phaser.GameObjects.Graphics;
    smokeGroup: Phaser.GameObjects.Group;
    puffGroup: Phaser.GameObjects.Group;
    impactGroup: Phaser.GameObjects.Group;
    isCoop: boolean;

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
        console.log(data);
        if (data.coop === true)
        {
            this.isCoop = true;
        }

        // log('death here?');
        // if (data?.retry === true)
        // {
        //     this.characters.forEach(character => character.destroy());
        //     this.characters.length = 0;
        // }
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
        this.customGame = new CustomeGame(this);
        this.customGame.init();


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

        this.stageCountdown.restart();

        if (!this.scene.isActive(SCENES_NAMES.HUD))
        {
            this.scene.launch(SCENES_NAMES.HUD);
        }
        else
        {
            this.events.emit(HUD_EVENTS_NAMES.RESET_PLAYER_A);
        }

        this.events.emit(HUD_EVENTS_NAMES.BOSS_HEALTH, 16);

        this.scene.get(SCENES_NAMES.BOOT).events.on(BTN_EVENTS.START_UP, this.setPause, this);

        this.cameraFollowPlayer();

        this.inputController.isActive = true;
    }

    public update(time: number, delta: number): void
    {
        // update customEffects
        this.customGame.customEffects.forEach(effect =>
        {
            if (effect.isActive) effect.update();
        });

        if (this.isCoop)
        {
            const cam = this.cameras.main;
            const distance = Math.abs(this.characters[0].body.center.x - this.characters[1].body.center.x);

            if (distance < 240)
            {
                cam.scrollX = Phaser.Math.Average([this.characters[0].x, this.characters[1].x]) - cam.width / 2;
                cam.scrollY = Phaser.Math.Average([this.characters[0].y, this.characters[1].y]) - cam.height / 2;
            }
        }

        if (isDev)
        {
            if (this.inputController.playerAButtons.x.isDown)
            {
                console.log({
                    updateTime: time,
                    sceneTime: this.time.now,
                    sysGameTime: this.sys.game.getTime(),
                    [this.scene.manager.scenes[0].scene.key]: this.scene.manager.scenes[0].time.now
                })
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
    }

    setPause()
    {
        if (this.isPaused)
        {
            this.physics.world.resume();

            this.anims.resumeAll();

            this.currentPlayingSong?.resume();

            this.isPaused = false;

            this.children.getByName('pauseText')?.destroy();

            return;
        }

        this.isPaused = true;

        this.anims.pauseAll();

        this.physics.world.pause();

        this.currentPlayingSong?.pause();

        this.playSound(1);

        this.add.bitmapText(WIDTH / 2, (HEIGHT - TILED_WORLD_OFFSET_Y) / 2, FONTS.GALAXY, 'pause', FONTS_SIZES.GALAXY, 1)
            .setScrollFactor(0, 0)
            .setOrigin(0.5, 0.5)
            .setName('pauseText')
            .setDepth(2000);
    }

    public shutdown()
    {
        this.scene.get(SCENES_NAMES.BOOT).events.off(BTN_EVENTS.START_UP, this.setPause, this);
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

        this.playersWeaponGroup = this.add.group();

        this.enemyWeaponGroup = this.add.group();
        this.enemyWeaponGroup.maxSize = 10;

        this.lightItemsGroup = this.add.group({
            classType: Phaser.GameObjects.PointLight,
            maxSize: 30,
        });

        this.enemyDeathGroup = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            maxSize: 100,
        });

        this.smokeGroup = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            key: ATLAS_NAMES.ITEMS,
            frame: 'smoke_1',
            maxSize: 6,
        });

        this.puffGroup = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            key: ATLAS_NAMES.ITEMS,
            frame: 'puff_1',
            maxSize: 6,
        });

        this.impactGroup = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            key: ATLAS_NAMES.ITEMS,
            frame: 'impact_1',
            maxSize: 6,
        });
    }

    public setCurrentStage()
    {
        this.time.addEvent({
            delay: 32,
            callback: () =>
            {
                const currentStage = this.getPlayerCurrentStage();

                const cameraBounds = this.cameras.main.getBounds();

                if (!currentStage) return;

                const { x, y, width, height } = currentStage;

                if (x !== cameraBounds.x
                    || y !== cameraBounds.y
                    || width !== cameraBounds.width
                    || height !== cameraBounds.height
                )
                {
                    this.cameras.main.setBounds(x!, y!, width!, height!);

                    const stageData = LayerService.convertTiledObjectProperties(currentStage.properties);

                    this.customGame.addCustomEffects();

                    this.customGame.checkCustomStageEffect(stageData?.stage);

                    this.changeMajorStage(stageData?.stage);

                    this.playSong(stageData?.musicIndex);

                    LayerService.addCandlesPointLight(this);
                    LayerService.addMovingPlatforms(this);
                    LayerService.addConveyors(this);

                    if (stageData?.stage === 71)
                    {
                        const backCastle = this.children.getByName('back-castle') as Phaser.GameObjects.Image;
                        backCastle.setAlpha(0);
                    }

                    this.customGame.addEnemies();

                    this.isChangingStage = false;
                }
            }
        })
    }

    private getPlayerCurrentStage()
    {
        const stages = LayerService.getObjectLayerByName(this, 'stage');

        const player = this.getPlayerByName(PLAYERS_NAMES.A);

        if (!stages) throw new Error(`no layer named stage found`);

        const { x, y } = player.body.center;

        return stages.objects.find(stage =>
        {
            const isX = x > stage.x! && x < stage.x! + stage.width!;

            const isY = y > stage.y! && y < stage.y! + stage.height!;

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

        const stages = LayerService.getObjectLayerByName(this, 'stage');

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
        const stages = LayerService.getObjectLayerByName(this, 'stage');

        if (!stages) throw new Error(`no layer named stage found`);

        const nextStage = stages.objects.find(stage =>
        {
            const isX = door.x >= stage.x! && door.x <= stage.x! + stage.width!;

            const isY = door.y >= stage.y! && door.y <= stage.y! + stage.height!;

            return (isX && isY);
        });

        if (!nextStage) return false;

        const nextStageProperties = LayerService.convertTiledObjectProperties(nextStage.properties);

        const currentStage = LayerService.convertTiledObjectProperties(this.getPlayerCurrentStage()?.properties)?.stage;

        // check authorized backtraking
        if (STAGE_BACKTRACK.includes(nextStageProperties?.stage) && nextStageProperties?.stage + 1 === currentStage)
        {
            return true;
        }

        // check unauthorized backtracking
        if (nextStageProperties?.stage < currentStage)
        {
            return false;
        }

        return true;
    }

    private changeMajorStage(stage: number)
    {
        const player = this.getPlayerByName(PLAYERS_NAMES.A);

        player.status.stage = stage;

        this.events.emit(HUD_EVENTS_NAMES.STAGE_PLAYER_A, stage);
    }

    public changeStage(nextDoor: TDoor)
    {
        if (this.canEnterStage(nextDoor) === false)
        {
            warn('stage already visited'.toUpperCase());

            return;
        }

        warn('changing stage'.toUpperCase());
        const player = this.getPlayerByName(PLAYERS_NAMES.A);

        if (!player) throw new Error("No player found");

        switch (nextDoor.side)
        {
            case 'left':
                this.characters.forEach(player => player.body.reset(nextDoor.x - player.body.width / 2, nextDoor.y));
                break;
            case 'right':
                this.characters.forEach(player => player.body.reset(nextDoor.x + TILE_SIZE + player.body.width / 2, nextDoor.y));
                break;
            case 'top':
                this.characters.forEach(player => player.body.reset(nextDoor.x + player.body.halfWidth, nextDoor.y - 48));
                break;
            case 'bottom':
                this.characters.forEach(player => player.body.reset(nextDoor.x + player.body.halfWidth, nextDoor.y + 32));
                break;
        }

        this.setCurrentStage();

        if (!player.physicsProperties.isDead && player.status.health > 0 && (player.status.life ?? 1) > 0)
        {
            player.status.setPosition({ x: player.x, y: player.y });

            SaveLoadService.saveGameData(player.status.toJson());

            this.stageCountdown.save();
        }
    }

    public endStage()
    {
        const orb = this.children.getByName('orb') as Orb;

        orb?.body.setEnable(false);

        orb.setActive(false).setVisible(false);

        this.stageCountdown.stop();

        const player = this.getPlayerByName(PLAYERS_NAMES.A);

        this.playSong(10, false);

        this.currentPlayingSong?.once(Phaser.Sound.Events.COMPLETE, () =>
        {
            orb?.destroy();


            const timerTime = this.time.addEvent({
                delay: 50,
                repeat: this.stageCountdown.getCountDown(),
                callback: () =>
                {
                    if (timerTime.getRepeatCount() > 0)
                    {
                        this.playSound(5);

                        this.stageCountdown.decrementCountdown();

                        player.status.setScore(player.status.score + 10);

                        this.events.emit(COUNTDOWN_EVENT, this.stageCountdown.getCountDown())
                    }

                    if (timerTime.getRepeatCount() === 0)
                    {
                        const timerAmmo = this.time.addEvent({
                            delay: 50,
                            repeat: player.status.ammo,
                            callback: () =>
                            {
                                if (timerAmmo.getRepeatCount() > 0)
                                {
                                    this.playSound(5);

                                    player.status.setAmmo(player.status.ammo - 1);

                                    player.status.setScore(player.status.score + 100);
                                }

                                if (timerAmmo.getRepeatCount() === 0)
                                {
                                    this.playSound(4);

                                    this.isBossBattle = false;

                                    this.nextStage();
                                }
                            }
                        });
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

        this.stageCountdown.stop();

        const player = this.getPlayerByName(PLAYERS_NAMES.A);

        this.playSong(11, false);
        this.currentPlayingSong?.once(Phaser.Sound.Events.COMPLETE, () =>
        {
            orb?.destroy();

            const timerTime = this.time.addEvent({
                delay: 50,
                repeat: this.stageCountdown.getCountDown(),
                callback: () =>
                {
                    if (timerTime.getRepeatCount() > 0)
                    {
                        this.playSound(5);

                        this.stageCountdown.decrementCountdown();

                        player.status.setScore(player.status.score + 10);

                        this.events.emit(COUNTDOWN_EVENT, this.stageCountdown.getCountDown())
                    }

                    if (timerTime.getRepeatCount() === 0)
                    {
                        const timerAmmo = this.time.addEvent({
                            delay: 50,
                            repeat: player.status.ammo,
                            callback: () =>
                            {
                                if (timerAmmo.getRepeatCount() > 0)
                                {
                                    this.playSound(5);

                                    player.status.setAmmo(player.status.ammo - 1);

                                    player.status.setScore(player.status.score + 100);
                                }

                                if (timerAmmo.getRepeatCount() === 0)
                                {
                                    this.playSound(4);

                                    this.isBossBattle = false;

                                    this.showCastleDestruction();
                                }
                            }
                        });
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
                this.characters.forEach(character => character.setActive(false).setVisible(false));

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
                        const content = `score: ${this.getPlayerByName(PLAYERS_NAMES.A).status.score}\ndeath: ${SaveLoadService.getPlayerDeathCount()}\nenemies killed: ${SaveLoadService.getEnemiesDeathCount()}\ntime: ${SaveLoadService.getSavedGameTimeToString()}`;

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

        this.characters.forEach(character => character.status.setHealth(16).setAmmo(5));

        this.customGame.isOrb = false;

        this.events.emit(HUD_EVENTS_NAMES.BOSS_HEALTH, 16);

        this.cameras.main.removeBounds().fadeOut(10);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        const player = this.characters[0];

        switch (player.status.stage)
        {
            case 15:
                this.characters.forEach(character =>
                {
                    character.status.setPosition(STAGE_START_POSITION[21]).setStage(21);
                    character.setFlipX(false);

                    character.body.reset(STAGE_START_POSITION[21].x, STAGE_START_POSITION[21].y);
                })

                this.stageCountdown.reset(true, STAGE_COUNTDOWN[21]);

                break;

            case 26:
                this.characters.forEach(character =>
                {
                    character.status.setPosition(STAGE_START_POSITION[31]).setStage(31);
                    character.setFlipX(true);

                    character.body.reset(STAGE_START_POSITION[31].x, STAGE_START_POSITION[31].y);
                })

                this.stageCountdown.reset(true, STAGE_COUNTDOWN[31]);

                break;

            case 35:
                this.characters.forEach(character =>
                {
                    character.status.setPosition(STAGE_START_POSITION[41]).setStage(41);
                    character.setFlipX(false);

                    character.body.reset(STAGE_START_POSITION[41].x, STAGE_START_POSITION[41].y);
                });

                this.stageCountdown.reset(true, STAGE_COUNTDOWN[41]);

                break;

            case 44:
                this.characters.forEach(character =>
                {
                    character.status.setPosition(STAGE_START_POSITION[51]).setStage(51)
                    character.setFlipX(false);

                    character.body.reset(STAGE_START_POSITION[51].x, STAGE_START_POSITION[51].y);
                });

                this.stageCountdown.reset(true, STAGE_COUNTDOWN[51]);

                break;

            case 56:
                this.characters.forEach(character =>
                {
                    character.status.setPosition(STAGE_START_POSITION[61]).setStage(61)
                    character.setFlipX(true);

                    character.body.reset(STAGE_START_POSITION[61].x, STAGE_START_POSITION[61].y);
                });

                this.stageCountdown.reset(true, STAGE_COUNTDOWN[61]);

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

    public cameraFollowPlayer(): Phaser.Cameras.Scene2D.Camera
    {
        if (this.characters.length === 1)
        {
            this.cameras.main.startFollow(this.getPlayerByName(PLAYERS_NAMES.A), true, 0.2, 0.1, 0, 0)
                .setDeadzone(4, 32)
                .setRoundPixels(true)
                .setBackgroundColor(PALETTE_DB32.BLACK);
        }

        return this.cameras.main;
    }

    public getPlayerByName(playerName: string): Entity
    {
        const player = this.children.getByName(playerName);

        if (player === null) throw new Error(`no player named ${playerName} found`);

        return player as Entity;
    }

    public getClosestPlayer(enemyBody: DamageBody): Entity
    {
        if (this.isCoop === false) return this.characters[0];

        const distanceA = Phaser.Math.Distance.BetweenPoints(enemyBody, this.characters[0].damageBody);

        const distanceB = Phaser.Math.Distance.BetweenPoints(enemyBody, this.characters[1]?.damageBody || { x: Infinity, y: Infinity });

        if (distanceA > distanceB) return this.characters[1];

        return this.characters[0];
    }

    public isInsideCameraByPixels(body: Phaser.Physics.Arcade.Body, offset: number = 128): boolean
    {
        const cam = this.cameras.main;

        return body.right < cam.worldView.right + offset && body.left > cam.worldView.left - offset
    }
}