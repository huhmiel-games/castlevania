import { FONTS, FONTS_SIZES, HEIGHT, SCENES_NAMES, WIDTH } from "../constant/config";
import { InputController } from "../inputs/InputController";

export default class MenuScene extends Phaser.Scene
{
    inputController: InputController;
    isGameSceneStarted: boolean = false;

    constructor()
    {
        super({
            key: SCENES_NAMES.MENU,
            active: false,
            visible: false
        });

        this.inputController = InputController.getInstance();
        this.inputController.isActive = false;
    }

    create()
    {
        this.input.enabled = false;
        //this.input?.keyboard?.enabled = false;

        // ---------------
        // DEV ONLY
        this.inputController.isActive = true;
        this.startGameScene();
        return;
        // ---------------

        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

        const logo = this.add.bitmapText(WIDTH / 2, HEIGHT / 5 * 4, FONTS.GALAXY, 'push start key', FONTS_SIZES.GALAXY, 1)
            .setOrigin(0.5, 0.5)
            .setName('debug')
            .setLetterSpacing(2)
            .setAlpha(0);

        const song = this.sound.add('0');
        song.once(Phaser.Sound.Events.COMPLETE, () =>
        {
            this.inputController.isActive = true;
            logo.setAlpha(1);
        });

        song.play()

        // this.time.addEvent({
        //     delay: 250,
        //     callback: () =>
        //     {
        //         this.inputController.isActive = true;
        //         logo.setAlpha
        //     }
        // })
    }

    update(time: number, delta: number): void
    {
        if (this.inputController.playerAButtons?.start.isDown)
        {
            this.startGameScene();
        }
    }

    public shutdown(): void
    {

    }

    startGameScene()
    {
        // if (this.isGameSceneStarted) return;

        // this.isGameSceneStarted = true;

        this.scene.start(SCENES_NAMES.GAME)
    }
}