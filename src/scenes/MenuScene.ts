import { PALETTE_DB32 } from "../constant/colors";
import { ATLAS_NAMES, BTN_EVENTS, FONTS, FONTS_SIZES, HEIGHT, SCENES_NAMES, WIDTH } from "../constant/config";
import { InputController } from "../inputs/InputController";
import SaveLoadService from "../services/SaveLoadService";
import { isMobileOs } from "../utils/isMobileOs";

export default class MenuScene extends Phaser.Scene
{
    private inputController: InputController;
    private icon: Phaser.GameObjects.Sprite;
    private choice: number = 0;
    private iconPosition: number[];
    private actions: (() => void)[];
    private song: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private isDeleteData: boolean = false;

    constructor()
    {
        super({
            key: SCENES_NAMES.MENU,
            active: false,
            visible: false
        });

        this.startGameScene = this.startGameScene.bind(this);
        this.startOptionScene = this.startOptionScene.bind(this);
        this.resetGameData = this.resetGameData.bind(this);
        this.deleteGameData = this.deleteGameData.bind(this);
        this.cancelDeleteGameData = this.cancelDeleteGameData.bind(this);

        this.upPress = this.upPress.bind(this);
        this.downPress = this.downPress.bind(this);
        this.aPress = this.aPress.bind(this);
        this.bPress = this.bPress.bind(this);
        this.startPress = this.startPress.bind(this);
    }

    create()
    {
        this.input.enabled = false;

        this.inputController = InputController.getInstance(this);
        this.inputController.isActive = false;

        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

        this.actions = [this.startGameScene, this.startOptionScene, this.resetGameData];

        const play1PButton = this.add.bitmapText(112, 148, FONTS.GALAXY, 'play', FONTS_SIZES.GALAXY, 1)
            .setOrigin(0.5, 0.5)
            .setName('play1PButton')
            .setLetterSpacing(2)
            .setAlpha(0);

        const optionButton = this.add.bitmapText(WIDTH / 2, HEIGHT / 5 * 4, FONTS.GALAXY, 'options', FONTS_SIZES.GALAXY, 1)
            .setOrigin(0.5, 0.5)
            .setName('optionButton')
            .setLetterSpacing(2)
            .setAlpha(0);

        const resetButton = this.add.bitmapText(WIDTH / 2, HEIGHT / 5 * 4, FONTS.GALAXY, 'erase data', FONTS_SIZES.GALAXY, 1)
            .setOrigin(0.5, 0.5)
            .setName('resetButton')
            .setLetterSpacing(2)
            .setAlpha(0);

        Phaser.Actions.AlignTo([play1PButton, optionButton, resetButton], Phaser.Display.Align.BOTTOM_LEFT);

        this.iconPosition = [play1PButton.y, optionButton.y, resetButton.y];

        this.anims.create({
            key: 'holy',
            frames: [
                { key: ATLAS_NAMES.ITEMS, frame: 'weapon-holywater_1' },
                { key: ATLAS_NAMES.ITEMS, frame: 'weapon-holywater_2' },
                { key: ATLAS_NAMES.ITEMS, frame: 'weapon-holywater_3' },
                { key: ATLAS_NAMES.ITEMS, frame: 'weapon-holywater_4' },
            ],
            frameRate: 16,
            repeat: -1,
        });

        this.icon = this.add.sprite(0, 0, ATLAS_NAMES.ITEMS, 'weapon-holywater_1')
            .setOrigin(0.5, 1)
            .setAlpha(0)
            .setPosition(play1PButton.x - 32, this.iconPosition[this.choice])
            .play('holy');

        this.song = this.sound.add('0');
        this.song.play();

        this.time.addEvent({
            delay: 1000,
            callback: () =>
            {
                this.inputController.isActive = true;

                play1PButton.setAlpha(1);

                optionButton.setAlpha(1);

                resetButton.setAlpha(1);

                this.icon.setAlpha(1);
            }
        });

        this.listenUpEvent();
    }

    listenUpEvent()
    {
        const bootScene = this.scene.get(SCENES_NAMES.BOOT);

        bootScene.events.on(BTN_EVENTS.UP_UP, this.upPress);
        bootScene.events.on(BTN_EVENTS.DOWN_UP, this.downPress);
        bootScene.events.on(BTN_EVENTS.A_UP, this.aPress);
        bootScene.events.on(BTN_EVENTS.B_UP, this.bPress);
        bootScene.events.on(BTN_EVENTS.START_UP, this.startPress);
    }

    private downPress()
    {
        if (!this.isDeleteData)
        {
            this.choice = Phaser.Math.Wrap(this.choice + 1, 0, 3);

            this.icon.setPosition(this.icon.x, this.iconPosition[this.choice]);
        }
    }

    private upPress()
    {
        if (!this.isDeleteData)
        {
            this.choice = Phaser.Math.Wrap(this.choice - 1, 0, 3);

            this.icon.setPosition(this.icon.x, this.iconPosition[this.choice]);
        }
    }

    private aPress()
    {
        if (!this.isDeleteData)
        {
            this.actions[this.choice]();
        }

        if (this.isDeleteData)
        {
            this.deleteGameData();
        }
    }

    private bPress()
    {
        if (!this.isDeleteData)
        {
            this.actions[this.choice]();
        }

        if (this.isDeleteData)
        {
            this.cancelDeleteGameData();
        }
    }

    private startPress()
    {
        if (!this.isDeleteData)
        {
            this.actions[this.choice]();
        }

        if (this.isDeleteData)
        {
            this.cancelDeleteGameData();
        }
    }

    public shutdown(): void
    {
        this.song.stop();

        const bootScene = this.scene.get(SCENES_NAMES.BOOT);

        bootScene.events.off(BTN_EVENTS.UP_UP, this.upPress);
        bootScene.events.off(BTN_EVENTS.DOWN_UP, this.downPress);
        bootScene.events.off(BTN_EVENTS.A_UP, this.aPress);
        bootScene.events.off(BTN_EVENTS.B_UP, this.bPress);
        bootScene.events.off(BTN_EVENTS.START_UP, this.startPress);
    }

    startGameScene()
    {
        this.scene.start(SCENES_NAMES.GAME);
    }

    startOptionScene()
    {
        this.scene.start(SCENES_NAMES.OPTIONS);
    }

    resetGameData()
    {
        this.time.addEvent({
            delay: 250,
            callback: () =>
            {
                this.isDeleteData = true;

                const resetButton = this.children.getByName('resetButton') as Phaser.GameObjects.BitmapText;

                resetButton.setText('a to confirm');
            }
        })
    }

    cancelDeleteGameData()
    {
        this.isDeleteData = false;

        const resetButton = this.children.getByName('resetButton') as Phaser.GameObjects.BitmapText;

        resetButton.setText('erase data');
    }

    deleteGameData()
    {
        this.isDeleteData = false;

        SaveLoadService.deleteGameData();

        this.sound.play('SFX1');

        const resetButton = this.children.getByName('resetButton') as Phaser.GameObjects.BitmapText;

        resetButton.setText('erase data');

        this.choice = 0;

        this.icon.setPosition(this.icon.x, this.iconPosition[this.choice]);
    }
}
