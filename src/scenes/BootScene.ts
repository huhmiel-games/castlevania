import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import { WIDTH, HEIGHT, FONTS, SCENES_NAMES, MOBILE_OS } from '../constant/config';
import { InputController } from '../inputs/InputController';
import { isMobileOs } from '../utils/isMobileOs';

/**
 * @author © Philippe Pereira 2021
 * @export
 * @class LogoScene
 * @extends {Scene}
 */
export default class BootScene extends Phaser.Scene
{
    public inputController: InputController;

    constructor()
    {
        super(SCENES_NAMES.BOOT);
    }

    public init()
    {
        document.onfullscreenchange = () =>
        {
            if (document.fullscreenElement === null)
            {
                this.scale.stopFullscreen();
            }
        };
    }

    public preload()
    {
        this.load.plugin('rexVirtualJoystickPlugin', VirtualJoystickPlugin, true);

        this.load.bitmapFont('galaxy', './assets/fonts/galaxy8.png', './assets/fonts/galaxy8.xml');

        this.load.image('background', './assets/graphics/backgrounds/background.png');
        this.load.image('progressBar', './assets/graphics/progress-bar.png');
        this.load.image('whitePixel', './assets/graphics/whitePixel.png');
        this.load.image('a-back', './assets/graphics/gamepad/a-back.png');
        this.load.image('b-back', './assets/graphics/gamepad/b-back.png');
        this.load.image('x-back', './assets/graphics/gamepad/x-back.png');
        this.load.image('y-back', './assets/graphics/gamepad/y-back.png');

        this.load.spritesheet('abxy', './assets/graphics/gamepad/abxy.png', { frameWidth: 16, frameHeight: 16 })

        this.cameras.main.setRoundPixels(true);

        this.input.setGlobalTopOnly(true);
    }

    public create()
    {
        this.scale.setParentSize(window.innerWidth, window.innerHeight);

        const logo = this.add.bitmapText(WIDTH / 2, HEIGHT / 2, FONTS.GALAXY, 'huhmiel games', 8, 1)
            .setOrigin(0.5, 0.5)
            .setName('logo')
            .setLetterSpacing(2)
            .setAlpha(0);

        this.tweens.add({
            targets: logo,
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 0,
            repeat: 0,
            yoyo: true,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1,
            },
            onComplete: () =>
            {
                logo.setActive(false).setVisible(false);

                this.inputController = InputController.getInstance(this);

                this.startInputListener();

                this.scene.run(SCENES_NAMES.LOAD);
            }
        });
    }

    public update(time: number, delta: number)
    {
        this.inputController?.gamepadAxisUpdate(time);
    }

    private startInputListener(): void
    {
        // wait for keyboard event
        this.listenKeyboardConnect();

        // wait for gamepad detection event
        this.listenGamepadConnect();

        // starts Pointer listeners if on mobile
        this.listenMobileEvent();
    }

    private listenKeyboardConnect()
    {
        // starts Keyboard listeners if on desktop
        if (this.sys.game.device.os.desktop === true)
        {
            this.inputController.addPlayerAButtons();
            this.input.keyboard?.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this.inputController.keyboardDownEvent, this.inputController);
            this.input.keyboard?.on(Phaser.Input.Keyboard.Events.ANY_KEY_UP, this.inputController.keyboardUpEvent, this.inputController);
            // this.input.keyboard?.once(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, (key: Phaser.Input.Keyboard.Key) =>
            // {
            //     this.inputController.addPlayerAButtons();
            //     this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this.inputController.keyboardDownEvent, this);
            //     this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_UP, this.inputController.keyboardUpEvent, this);
            // });
        }
    }

    private listenGamepadConnect()
    {
        this.input.gamepad?.on(Phaser.Input.Gamepad.Events.CONNECTED, () =>
        {
            const gamepadIcon = this.add.image(WIDTH / 2, 16, 'items', 'gamepad');

            this.tweens.add({
                duration: 250,
                targets: gamepadIcon,
                alpha: 0,
                yoyo: true,
                repeat: 5,
                onComplete: () => gamepadIcon.destroy()
            });

            this.scene.bringToTop();

            this.inputController.addGamepad(this.input.gamepad!);
        });

        // this.input.gamepad?.once(Phaser.Input.Gamepad.Events.BUTTON_DOWN, () => {
        //     this.add.bitmapText(WIDTH / 2, 16, FONTS.GALAXY, 'gamepad connected', FONTS_SIZES.GALAXY, 1);
        //     this.scene.bringToTop();
        //     this.inputController.addGamepad(this.input.gamepad!);
        // })
    }

    private listenMobileEvent()
    {
        if (isMobileOs(this))
        {
            this.input.addPointer(1);

            this.inputController.addPlayerAButtons();

            // this.inputController.addVirtualGamepad(this);

            //this.scene.bringToTop();

            // this.input.once(Phaser.Input.Events.POINTER_UP, () => this.scale.startFullscreen());

        }
    }
}