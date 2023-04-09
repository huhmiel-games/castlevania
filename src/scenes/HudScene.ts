import { WIDTH, FONTS, SCENES_NAMES, TILED_WORLD_OFFSET_Y, HUD_EVENTS_NAMES, PLAYERS_NAMES, COUNTDOWN_EVENT, ATLAS_NAMES } from '../constant/config';
import GameScene from './GameScene';
import { TStatus } from '../types/types';
import { PALETTE_DB32 } from '../constant/colors';

/**
 * @author © Philippe Pereira 2022
 * @export
 * @class HudScene
 * @extends {Scene}
 */
export default class HudScene extends Phaser.Scene
{
    private gameScene: GameScene;
    private playerStatus: TStatus;
    private enemyLifeBlocks: Phaser.GameObjects.Image[] = [];

    constructor()
    {
        super(SCENES_NAMES.HUD);
    }

    public init()
    {
        this.cameras.main.setSize(WIDTH, TILED_WORLD_OFFSET_Y);
    }

    public preload()
    {

    }

    public create()
    {
        this.input.enabled = false;

        this.gameScene = this.scene.get(SCENES_NAMES.GAME) as GameScene;

        this.gameScene.events.on(HUD_EVENTS_NAMES.HEALTH_PLAYER_A, this.setPlayerHealth, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.LIFE_PLAYER_A, this.setLife, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.HEART_PLAYER_A, this.setHeart, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.STAGE_PLAYER_A, this.setStage, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.SCORE_PLAYER_A, this.setScore, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.WEAPON_PLAYER_A, this.setWeaponImage, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.RESET_PLAYER_A, this.resetData, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.SHOTS_PLAYER_A, this.setShots, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.BOSS_HEALTH, this.setBossHealth, this);
        this.gameScene.events.on(COUNTDOWN_EVENT, this.setCountDownText, this)

        this.getPlayerStatus();

        this.add.bitmapText(2, 2, FONTS.GALAXY, '', 8, 1)
            .setOrigin(0, 0)
            .setName('scoreText')
            .setText(`score-${this.playerStatus.score?.toString().padStart(6, '0')}`);

        const player = this.add.bitmapText(2, 12, FONTS.GALAXY, 'player', 8, 1)
            .setOrigin(0, 0)
            .setName('playerAText');

        const enemyText = this.add.bitmapText(2, 22, FONTS.GALAXY, 'enemy', 8, 1)
            .setOrigin(0, 0)
            .setName('enemyText');

        const countDownText = this.add.bitmapText(112, 2, FONTS.GALAXY, 'time 0000', 8, 1)
            .setOrigin(0, 0)
            .setName('countDown');

        const stage = this.add.bitmapText(192, 2, FONTS.GALAXY, 'stage 01', 8, 1)
            .setOrigin(0, 0)
            .setName('stage')
            .setText(`stage ${this.playerStatus.stage?.toString().padStart(2, '0')}`);

        const weaponFrame = this.add.image(128, 20, ATLAS_NAMES.ITEMS, 'weapon-frame').setOrigin(0, 0.5);
        const weaponImage = this.add.image(144, 20, ATLAS_NAMES.ITEMS, '').setOrigin(0.5, 0.5).setName('weaponImage').setAlpha(0);
        this.add.image(168, 12, ATLAS_NAMES.ITEMS, 'heart').setOrigin(0, 0);
        const doubleShot = this.add.image(208, 12, ATLAS_NAMES.ITEMS, 'double-shot').setOrigin(0, 0).setName('shotImage').setAlpha(0);

        this.add.bitmapText(177, 13, FONTS.GALAXY, '-00', 8, 1)
            .setOrigin(0, 0)
            .setName('heartText')

        const lifeText = this.add.bitmapText(169, 22, FONTS.GALAXY, 'p-03', 8, 1)
            .setOrigin(0, 0)
            .setName('life')

        for (let i = 0; i < 16; i += 1)
        {
            this.add.image(56 + i * 4, 11, ATLAS_NAMES.ITEMS, 'health_0').setOrigin(0, 0).setName(`player-a-health_${i + 1}`);
        }

        for (let i = 0; i < 16; i += 1)
        {
            const offsetY = this.gameScene.isCoop ? 33 : 21;
            const life = this.add.image(56 + i * 4, offsetY, ATLAS_NAMES.ITEMS, 'health_1').setOrigin(0, 0).setName(`boss-health_${i + 1}`);

            this.enemyLifeBlocks.push(life);
        }

        if (this.gameScene.isCoop)
        {
            this.cameras.main.setSize(WIDTH, TILED_WORLD_OFFSET_Y + 16);

            stage.setAlpha(0);

            weaponFrame.setAlpha(0);

            weaponImage.y -= 4;

            countDownText.x -= 16;

            doubleShot.y -= 6;

            lifeText.x += 48;
            lifeText.y = 13;

            player.setText(this.gameScene.characters[0].name);

            this.add.bitmapText(WIDTH - 2, 2, FONTS.GALAXY, '', 8, 1)
                .setOrigin(1, 0)
                .setName('scoreTextB')
                .setText(`score-${this.playerStatus.score?.toString().padStart(6, '0')}`);

            this.add.bitmapText(2, 22, FONTS.GALAXY, PLAYERS_NAMES.B, 8, 1)
                .setOrigin(0, 0)
                .setName('playerBText');

            this.add.bitmapText(169 + 48, 23, FONTS.GALAXY, 'p-03', 8, 1)
                .setOrigin(0, 0)
                .setName('lifeB');

            this.add.image(144, 24, ATLAS_NAMES.ITEMS, '').setOrigin(0.5, 0.5).setName('weaponImageB').setAlpha(0);

            this.add.image(208, 16, ATLAS_NAMES.ITEMS, 'double-shot').setOrigin(0, 0).setName('shotImageB').setAlpha(0);

            this.add.image(168, 22, ATLAS_NAMES.ITEMS, 'heart').setOrigin(0, 0);

            this.add.bitmapText(177, 23, FONTS.GALAXY, '-00', 8, 1)
            .setOrigin(0, 0)
            .setName('heartTextB')

            for (let i = 0; i < 16; i += 1)
            {
                this.add.image(56 + i * 4, 21, ATLAS_NAMES.ITEMS, 'health_0').setOrigin(0, 0).setName(`player-b-health_${i + 1}`);
            }
            enemyText.y += 12;
            enemyText.setAlpha(0);

            this.enemyLifeBlocks.forEach(elm => elm.setAlpha(0));

            this.gameScene.events.on(HUD_EVENTS_NAMES.HEALTH_PLAYER_B, this.setPlayerHealthB, this);
            this.gameScene.events.on(HUD_EVENTS_NAMES.LIFE_PLAYER_B, this.setLifeB, this);
            this.gameScene.events.on(HUD_EVENTS_NAMES.HEART_PLAYER_B, this.setHeartB, this);
            this.gameScene.events.on(HUD_EVENTS_NAMES.SCORE_PLAYER_B, this.setScoreB, this);
            this.gameScene.events.on(HUD_EVENTS_NAMES.WEAPON_PLAYER_B, this.setWeaponImageB, this);
            this.gameScene.events.on(HUD_EVENTS_NAMES.SHOTS_PLAYER_B, this.setShotsB, this);
        }

        this.resetData();
    }

    private getPlayerStatus(): TStatus
    {
        const { status } = this.gameScene.getPlayerA();

        this.playerStatus = status;

        return status;
    }

    private resetData()
    {
        const statusPlayerA = this.getPlayerStatus();

        this.setPlayerHealth(statusPlayerA.health).setLife(statusPlayerA.life ?? 0)
            .setHeart(statusPlayerA.ammo || 5)
            .setScore(statusPlayerA.score)
            .setLife(statusPlayerA.life)
            .setStage(statusPlayerA.stage)
            .setWeaponImage('no weapon');

        if(this.gameScene.isCoop)
        {
            const statusPlayerB = this.gameScene.characters[1].status;

            this.setPlayerHealthB(statusPlayerB.health).setLife(statusPlayerB.life ?? 0)
            .setHeartB(statusPlayerB.ammo || 5)
            .setScoreB(statusPlayerB.score)
            .setLifeB(statusPlayerB.life)
            .setWeaponImageB('no weapon');
        }
    }

    private setShots(value: number)
    {
        const shotImage = this.children.getByName('shotImage') as Phaser.GameObjects.Image;

        if (value === 1)
        {
            shotImage?.setAlpha(0);
        }

        if (value === 2)
        {
            shotImage?.setFrame('double-shot').setAlpha(1);
        }

        if (value === 3)
        {
            shotImage?.setFrame('triple-shot').setAlpha(1);
        }
    }

    private setShotsB(value: number)
    {
        const shotImage = this.children.getByName('shotImageB') as Phaser.GameObjects.Image;

        if (value === 1)
        {
            shotImage?.setAlpha(0);
        }

        if (value === 2)
        {
            shotImage?.setFrame('double-shot').setAlpha(1);
        }

        if (value === 3)
        {
            shotImage?.setFrame('triple-shot').setAlpha(1);
        }
    }

    private setPlayerHealth(health: number)
    {
        const children = this.children.getAll().filter(obj => obj.name.startsWith('player-a-health_')) as Phaser.GameObjects.Image[];
        children.forEach(child =>
        {
            const id = Number(child.name.match(/\d+/g));

            if (id > health)
            {
                child.setFrame('health_2');
            }
            else
            {
                child.setFrame('health_0');
            }
        });

        return this;
    }

    private setPlayerHealthB(health: number)
    {
        const children = this.children.getAll().filter(obj => obj.name.startsWith('player-b-health_')) as Phaser.GameObjects.Image[];
        children.forEach(child =>
        {
            const id = Number(child.name.match(/\d+/g));

            if (id > health)
            {
                child.setFrame('health_2');
            }
            else
            {
                child.setFrame('health_0');
            }
        });

        return this;
    }

    private setBossHealth(health: number)
    {
        const children = this.children.getAll().filter(obj => obj.name.startsWith('boss-health_')) as Phaser.GameObjects.Image[];
        children.forEach(child =>
        {
            const id = Number(child.name.match(/\d+/g));

            if (id > health)
            {
                child.setFrame('health_2');
            }
            else
            {
                child.setFrame('health_1');
            }
        });

        return this;
    }

    private setHeart(value: number)
    {
        const heartText = this.children.getByName('heartText') as Phaser.GameObjects.BitmapText;

        heartText.setText(`-${value.toString().padStart(2, '0')}`);

        return this;
    }

    private setHeartB(value: number)
    {
        const heartText = this.children.getByName('heartTextB') as Phaser.GameObjects.BitmapText;

        heartText.setText(`-${value.toString().padStart(2, '0')}`);

        return this;
    }

    private setScore(value: number)
    {
        const scoreText = this.children.getByName('scoreText') as Phaser.GameObjects.BitmapText;

        scoreText.setText(`score-${value.toString().padStart(6, '0')}`);

        return this;
    }

    private setScoreB(value: number)
    {
        const scoreText = this.children.getByName('scoreTextB') as Phaser.GameObjects.BitmapText;

        scoreText.setText(`score-${value.toString().padStart(6, '0')}`);

        return this;
    }

    private setStage(value: number)
    {
        const stage = this.children.getByName('stage') as Phaser.GameObjects.BitmapText;

        stage.setText(`stage ${value.toString()[0].padStart(2, '0')}`);

        return this;
    }

    private setWeaponImage(frame: string)
    {
        const weaponImage = this.children.getByName('weaponImage') as Phaser.GameObjects.Image;

        if (frame === 'no weapon')
        {
            weaponImage.setAlpha(0);
        }
        else
        {
            const frameName = this.gameScene.isCoop ? frame + '-mini' : frame;
            weaponImage.setFrame(frameName).setAlpha(1);
        }
    }

    private setWeaponImageB(frame: string)
    {
        const weaponImage = this.children.getByName('weaponImageB') as Phaser.GameObjects.Image;

        if (frame === 'no weapon')
        {
            weaponImage.setAlpha(0);
        }
        else
        {
            const frameName = this.gameScene.isCoop ? frame + '-mini' : frame;
            weaponImage.setFrame(frameName).setAlpha(1);
        }
    }

    private setLife(life: number)
    {
        const lifeText = this.children.getByName('life') as Phaser.GameObjects.BitmapText;

        lifeText.setText(`p-${Phaser.Math.Clamp(life, 0, 10).toString().padStart(2, '0')}`);

        return this;
    }

    private setLifeB(life: number)
    {
        const lifeText = this.children.getByName('lifeB') as Phaser.GameObjects.BitmapText;

        lifeText.setText(`p-${Phaser.Math.Clamp(life, 0, 10).toString().padStart(2, '0')}`);

        return this;
    }

    private setCountDownText(countdown: number)
    {
        const countDownText = this.children.getByName('countDown') as Phaser.GameObjects.BitmapText;

        countDownText.setText(`time ${countdown.toString().padStart(4, '0')}`);
    }
}