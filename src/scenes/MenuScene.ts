import { ATLAS_NAMES, FONTS, FONTS_SIZES, HEIGHT, SCENES_NAMES, WIDTH } from "../constant/config";
import { InputController } from "../inputs/InputController";

export default class MenuScene extends Phaser.Scene
{
    private inputController: InputController;
    private icon: Phaser.GameObjects.Sprite;
    private choice: 0 | 1 = 0;
    private iconPosition: number[];
    private actions: (() => void)[];
    private song: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private throttleTime: number = 0;

    constructor()
    {
        super({
            key: SCENES_NAMES.MENU,
            active: false,
            visible: false
        });

        this.inputController = InputController.getInstance();
        this.inputController.isActive = false;

        this.startGameScene = this.startGameScene.bind(this);
        this.startOptionScene = this.startOptionScene.bind(this);
    }

    create()
    {
        this.input.enabled = false;

        this.inputController = InputController.getInstance(this);
        this.inputController.isActive = false;
        // ---------------
        // DEV ONLY
        // this.inputController.isActive = true;
        // this.startGameScene();
        // return;
        // ---------------

        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

        this.actions = [this.startGameScene, this.startOptionScene];

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

        Phaser.Actions.AlignTo([play1PButton, optionButton], Phaser.Display.Align.BOTTOM_LEFT);

        this.iconPosition = [play1PButton.y, optionButton.y];

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

                this.icon.setAlpha(1);
            }
        });
    }

    update(time: number, delta: number): void
    {
        const { up, down, a, b, start } = this.inputController.playerAButtons;

        if (this.throttleTime < time 
            && ((down.isDown && down.getDuration(time) < 12)
            || (up.isDown && up.getDuration(time) < 12))
        )
        {
            this.throttleTime = time + 128;

            const choice = 1 - this.choice;

            if (choice === 0 || choice === 1) this.choice = choice;

            this.icon.setPosition(this.icon.x, this.iconPosition[choice]);
        }

        if ((start.isDown && start.getDuration(time) < 12)
            || (a.isDown && a.getDuration(time) < 12)
            || (b.isDown && b.getDuration(time) < 12)
        )
        {
            this.actions[this.choice]();
        }
    }

    public shutdown(): void
    {
        this.song.stop();
    }

    startGameScene()
    {
        this.scene.start(SCENES_NAMES.GAME)
    }

    startOptionScene()
    {
        this.scene.start(SCENES_NAMES.OPTIONS)
    }
}
