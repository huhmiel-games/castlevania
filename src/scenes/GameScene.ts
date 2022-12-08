// @ts-ignore
import animatedTilesPlugin from '../plugins/AnimatedTiles.js';
import { HUD_EVENTS_NAMES, PLAYER_A_NAME, SCENES_NAMES, STAGE_BACKTRACK, TILED_WORLD_OFFSET_Y, TILE_SIZE } from '../constant/config';
import { InputController } from '../inputs/InputController';
import { ISoundList } from '../interfaces/interface.js';
import LayerService from '../services/LayerService.js';
import { Entity } from '../entities/Entity.js';
import ColliderService from '../services/ColliderService.js';
import WorldRooms from '../utils/WorldRooms.js';
import { TCoord, TDoor } from '../types/types.js';
import SaveLoadService from '../services/SaveLoadService.js';
import { PALETTE_DB32 } from '../constant/colors.js';
import init from '../custom/init.js';
import addEnemies from '../custom/addEnemies.js';

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
    private soundList: ISoundList = {};
    public colliderLayer: Phaser.Tilemaps.TilemapLayer;
    public characters: Entity[] = [];
    public enemies: Entity[] = [];
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
            const status = { ...this.characters[0].status };
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

        this.lightCandlesGroup = this.add.group({
            classType: Phaser.GameObjects.PointLight,
            maxSize: 2000,
        });

        this.enemyDeathGroup = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            maxSize: 10,
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

                    addEnemies(this);
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
            player.setStatusPosition({ x: player.x, y: player.y });

            SaveLoadService.saveGameData(player.status);
        }
    }

    private setParallaxImagePosition(width: number)
    {
        const backParallax = this.children.getByName('parallax-mountain') as Phaser.GameObjects.TileSprite;
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
}