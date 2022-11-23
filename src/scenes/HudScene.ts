import { Entity } from '../entities/Entity';
import { PALETTE_DB32 } from '../constant/colors';
import { WIDTH, HEIGHT, FONTS, SCENES_NAMES, TILED_WORLD_OFFSET_Y, HUD_EVENTS_NAMES, PLAYER_A_NAME } from '../constant/config';
import Health from '../hud/Health';
import Heart from '../hud/Heart';
import { IStatus } from '../interfaces/interface';
import GameScene from './GameScene';

/**
 * @author © Philippe Pereira 2022
 * @export
 * @class GameOverScene
 * @extends {Scene}
 */
export default class HudScene extends Phaser.Scene
{
    private health: Health = new Health();
    private score: number = 0;
    private timeInSeconds: number = 300;
    private stage: string = 'stage 1';
    private heart: Heart = new Heart()
    private life: number = 3;
    private gameScene: GameScene;
    private playerStatus: IStatus;

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

        this.gameScene.events.on(HUD_EVENTS_NAMES.HEALTH, this.setPlayerHealth, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.LIFE, this.setLife, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.HEART, this.setHeart, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.STAGE, this.setStage, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.SCORE, this.setScore, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.WEAPON, this.setWeaponImage, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.RESET, this.resetData, this);
        this.gameScene.events.on(HUD_EVENTS_NAMES.SHOTS, this.setShots, this);

        this.getPlayerStatus();

        const score: Phaser.GameObjects.BitmapText = this.add.bitmapText(2, 2, FONTS.GALAXY, '', 8, 1)
            .setOrigin(0, 0)
            .setName('scoreText')
            .setText(`score-${this.playerStatus.score?.toString().padStart(6, '0')}`);

        const player: Phaser.GameObjects.BitmapText = this.add.bitmapText(2, 12, FONTS.GALAXY, 'player', 8, 1)
            .setOrigin(0, 0)
            .setName('helperText');

        const enemy: Phaser.GameObjects.BitmapText = this.add.bitmapText(2, 22, FONTS.GALAXY, 'enemy', 8, 1)
            .setOrigin(0, 0)
            .setName('helperText');

        const countDown: Phaser.GameObjects.BitmapText = this.add.bitmapText(112, 2, FONTS.GALAXY, 'time 0000', 8, 1)
            .setOrigin(0, 0)
            .setName('countDown');

        const stage: Phaser.GameObjects.BitmapText = this.add.bitmapText(192, 2, FONTS.GALAXY, 'stage 01', 8, 1)
            .setOrigin(0, 0)
            .setName('stage')
            .setText(`stage ${this.playerStatus.stage?.toString().padStart(2, '0')}`)

        const weaponFrame = this.add.image(128, 20, 'items', 'weapon-frame').setOrigin(0, 0.5);
        const weaponImage = this.add.image(144, 20, 'items', '').setOrigin(0.5, 0.5).setName('weaponImage').setAlpha(0);
        const heartImage = this.add.image(168, 12, 'items', 'heart').setOrigin(0, 0);
        const shotImage = this.add.image(208, 12, 'items', 'double-shot').setOrigin(0, 0).setName('shotImage').setAlpha(0);

        const heartText: Phaser.GameObjects.BitmapText = this.add.bitmapText(177, 13, FONTS.GALAXY, '-00', 8, 1)
            .setOrigin(0, 0)
            .setName('heartText')


        const lifeText: Phaser.GameObjects.BitmapText = this.add.bitmapText(169, 22, FONTS.GALAXY, 'p-03', 8, 1)
            .setOrigin(0, 0)
            .setName('life')


        for (let i = 0; i < 16; i += 1)
        {
            this.add.image(56 + i * 4, 11, 'items', 'health_0').setOrigin(0, 0).setName(`player-health_${i + 1}`);
        }

        for (let i = 0; i < 16; i += 1)
        {
            this.add.image(56 + i * 4, 21, 'items', 'health_1').setOrigin(0, 0).setName(`enemy-health_${i + 1}`);
        }

        this.startCountDown(300);

        this.resetData();
    }

    private getPlayerStatus(): IStatus
    {
        const { status } = this.gameScene.getPlayerByName(PLAYER_A_NAME);

        this.playerStatus = status;

        return status;
    }

    private resetData()
    {
        const status = this.getPlayerStatus();

        this.setPlayerHealth(status.health).setLife(status.life ?? 0)
            .setHeart(status.ammo)
            .setScore(status.score)
            .setLife(status.life)
            .setStage(status.stage)
            .setWeaponImage('no weapon');
    }

    private setShots(value: number)
    {
        const shotImage = this.children.getByName('shotImage') as Phaser.GameObjects.Image;

        if (value === 1)
        {
            shotImage?.setAlpha(0);
        }

        if(value === 2)
        {
            shotImage?.setFrame('double-shot').setAlpha(1);
        }

        if(value === 3)
        {
            shotImage?.setFrame('triple-shot').setAlpha(1);
        }
    }

    private setPlayerHealth(health: number)
    {
        const children = this.children.getAll().filter(obj => obj.name.startsWith('player-health_')) as Phaser.GameObjects.Image[];
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

    private setHeart(value: number)
    {
        const heartText = this.children.getByName('heartText') as Phaser.GameObjects.BitmapText;

        heartText.setText(`-${value.toString().padStart(2, '0')}`);

        return this;
    }

    private setScore(value: number)
    {
        const scoreText = this.children.getByName('scoreText') as Phaser.GameObjects.BitmapText;

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

        weaponImage.setFrame(frame).setAlpha(1);
    }

    private startCountDown(time: number)
    {
        const countDown = this.time.addEvent({
            delay: 1000,
            repeat: time,
            callback: this.setCountDownText,
            callbackScope: this
        })


        countDown.args = [countDown];
    }

    private setLife(life: number)
    {
        const lifeText = this.children.getByName('life') as Phaser.GameObjects.BitmapText;

        lifeText.setText(`p-${life.toString().padStart(2, '0')}`);

        return this;
    }

    private setCountDownText(timerEvent: Phaser.Time.TimerEvent)
    {
        const countDownText = this.children.getByName('countDown') as Phaser.GameObjects.BitmapText;

        countDownText.setText(`time ${timerEvent.repeatCount.toString().padStart(4, '0')}`);

        if (timerEvent.repeatCount === 0)
        {
            const player = this.gameScene.children.getByName(PLAYER_A_NAME) as Entity;

            player?.die();
        }
    }
}