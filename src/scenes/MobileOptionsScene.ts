import { Scene } from 'phaser';
import { PALETTE_DB32 } from '../constant/colors';
import { WIDTH, FONTS, FONTS_SIZES, SCENES_NAMES, BUTTONS_NAMES, HEIGHT, ATLAS_NAMES, BTN_EVENTS } from '../constant/config';
import { InputController } from '../inputs/InputController';
import SaveLoadService from '../services/SaveLoadService';
import { TKeyMapping, TMobileConfig } from '../types/types';

/**
 * @author © Philippe Pereira 2023
 * @export
 * @class MobileOptionsScene
 * @extends {Scene}
 */
export default class MobileOptionsScene extends Scene
{
    inputController: InputController;
    private mobileConfig: TMobileConfig;
    private keysText: Phaser.GameObjects.BitmapText[] = [];
    private saveText: Phaser.GameObjects.BitmapText;
    private resetText: Phaser.GameObjects.BitmapText;
    private quitText: Phaser.GameObjects.BitmapText;
    private choice: number = 0;
    private icon: Phaser.GameObjects.Sprite;
    private iconPosition: number[];
    private actions: (() => void)[] = [];
    private selectedJStatic: Phaser.GameObjects.BitmapText;
    private selectedJSize: Phaser.GameObjects.BitmapText;
    private selectedJPosition: Phaser.GameObjects.BitmapText;
    private selectedJVibration: Phaser.GameObjects.BitmapText;
    private hasChanged: boolean = false;

    constructor()
    {
        super(SCENES_NAMES.MOBILE_OPTIONS);

        this.inputController = InputController.getInstance();

        this.save = this.save.bind(this);
        this.quit = this.quit.bind(this);
        this.reset = this.reset.bind(this);
        this.upPress = this.upPress.bind(this);
        this.downPress = this.downPress.bind(this);
        this.startAction = this.startAction.bind(this);
    }

    public create()
    {
        this.inputController.isActive = false;
        this.input.enabled = true;
        this.input.keyboard!.enabled = true;

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

        this.mobileConfig = SaveLoadService.getMobileConfig();

        this.add.image(0, 0, 'background')
            .setOrigin(0, 0);

        this.add.image(0, 0, 'whitePixel').setDisplaySize(WIDTH, HEIGHT).setTintFill(PALETTE_DB32.BLACK).setOrigin(0, 0).setAlpha(0.85);


        this.add.bitmapText(WIDTH / 2, 16, FONTS.GALAXY, 'options', FONTS_SIZES.GALAXY, 1)
            .setOrigin(0.5, 0.5)
            .setLetterSpacing(2)
            .setTintFill(PALETTE_DB32.WELL_READ);

        const arr = ['joystick static', 'joystick size', 'joystick position', 'vibration']
        arr.forEach(btnName =>
        {
            const txt = this.add.bitmapText(WIDTH / 10, 64, FONTS.GALAXY, `${btnName}`, FONTS_SIZES.GALAXY, 0);

            this.keysText.push(txt);
        });

        this.saveText = this.add.bitmapText(0, 0, FONTS.GALAXY, 'save', FONTS_SIZES.GALAXY, 0).setTintFill(PALETTE_DB32.CONIFER);
        this.resetText = this.add.bitmapText(0, 0, FONTS.GALAXY, 'reset', FONTS_SIZES.GALAXY, 0).setTintFill(PALETTE_DB32.WELL_READ);
        this.quitText = this.add.bitmapText(0, 0, FONTS.GALAXY, 'quit', FONTS_SIZES.GALAXY, 0).setTintFill(PALETTE_DB32.EAST_BAY);

        this.keysText.push(this.saveText, this.resetText, this.quitText);

        this.actions.push(this.toggleJoystickStatic,
            this.changeJoystickSize,
            this.changeJoystickPosition,
            this.toggleVibration,
            this.save,
            this.reset,
            this.quit);

        Phaser.Actions.AlignTo(this.keysText, Phaser.Display.Align.BOTTOM_LEFT);

        this.iconPosition = this.keysText.map(elm => elm.y);

        this.icon = this.add.sprite(WIDTH / 14, this.iconPosition[this.choice], ATLAS_NAMES.ITEMS, 'weapon-holywater_1')
            .setOrigin(0.5, 0.7)
            .play('holy');

        this.selectedJStatic = this.add.bitmapText(WIDTH / 3 * 2, 64, FONTS.GALAXY, `${this.mobileConfig.joystickStatic ? 'on' : 'off'}`, FONTS_SIZES.GALAXY, 1).setTintFill(PALETTE_DB32.WELL_READ);
        this.selectedJSize = this.add.bitmapText(0, 0, FONTS.GALAXY, `${this.mobileConfig.joystickSize}`, FONTS_SIZES.GALAXY, 1).setTintFill(PALETTE_DB32.WELL_READ);
        this.selectedJPosition = this.add.bitmapText(0, 0, FONTS.GALAXY, `x: ${this.mobileConfig.joystickPosition.left} y: ${this.mobileConfig.joystickPosition.top}`, FONTS_SIZES.GALAXY, 1).setTintFill(PALETTE_DB32.WELL_READ);
        this.selectedJVibration = this.add.bitmapText(0, 0, FONTS.GALAXY, `${this.mobileConfig.vibration ? 'on' : 'off'}`, FONTS_SIZES.GALAXY, 1).setTintFill(PALETTE_DB32.WELL_READ);

        Phaser.Actions.AlignTo([
            this.selectedJStatic,
            this.selectedJSize,
            this.selectedJPosition,
            this.selectedJVibration
        ], Phaser.Display.Align.BOTTOM_LEFT);

        // fading the scene from black
        this.cameras.main.fadeIn(500);

        const bootScene = this.scene.get(SCENES_NAMES.BOOT);

        bootScene.events.on(BTN_EVENTS.UP_UP, this.upPress);
        bootScene.events.on(BTN_EVENTS.DOWN_UP, this.downPress);
        bootScene.events.on(BTN_EVENTS.A_UP, this.startAction);
        bootScene.events.on(BTN_EVENTS.B_UP, this.startAction);
        bootScene.events.on(BTN_EVENTS.START_UP, this.startAction);
    }

    private toggleJoystickStatic()
    {
        this.mobileConfig.joystickStatic = !this.mobileConfig.joystickStatic;

        const text = this.mobileConfig.joystickStatic ? 'on' : 'off';

        this.selectedJStatic.setText(text);
    }

    private changeJoystickSize()
    {
        switch (this.mobileConfig.joystickSize)
        {
            case 64:
                this.mobileConfig.joystickSize = 50
                break;
            case 50:
                this.mobileConfig.joystickSize = 40
                break;
            case 40:
                this.mobileConfig.joystickSize = 32
                break;
            case 32:
                this.mobileConfig.joystickSize = 64
                break;
            default:
                break;
        }

        this.selectedJSize.setText(this.mobileConfig.joystickSize.toString())
    }

    private changeJoystickPosition()
    {
        this.selectedJPosition.setText('??')

        document.addEventListener('touchstart', (event) =>
        {
            const { screenX, screenY, radiusX } = event.touches[0];

            const {innerWidth, innerHeight} = window;

            const x = Phaser.Math.Clamp(Math.round((screenX - (this.mobileConfig.joystickSize / 2)) / (innerWidth / 100)), 5, 50);
            const y = Phaser.Math.Clamp(Math.round((screenY - radiusX) / (innerHeight / 100)), 15, 85);

            this.mobileConfig.joystickPosition.left = `${x}%`;
            this.mobileConfig.joystickPosition.top = `${y}%`;
            
            const joystick = document.getElementsByClassName('Gamepad-anchor')[0] as HTMLDivElement;

            if(joystick)
            {
                joystick.style.left = `${x}%`;
                joystick.style.top = `${y}%`;
            }

            this.selectedJPosition.setText(`x: ${this.mobileConfig.joystickPosition.left} y: ${this.mobileConfig.joystickPosition.top}`)
        },
        { 
            once: true 
        });
    }

    private toggleVibration()
    {
        this.mobileConfig.vibration = !this.mobileConfig.vibration;

        const text = this.mobileConfig.vibration ? 'on' : 'off';

        this.selectedJVibration.setText(text);
    }

    private downPress()
    {
        this.choice = Phaser.Math.Wrap(this.choice + 1, 0, this.keysText.length);

        this.icon.setPosition(this.icon.x, this.iconPosition[this.choice]);
    }

    private upPress()
    {
        this.choice = Phaser.Math.Wrap(this.choice - 1, 0, this.keysText.length);

        this.icon.setPosition(this.icon.x, this.iconPosition[this.choice]);
    }

    private startAction()
    {
        this.actions[this.choice].call(this);
    }

    private save()
    {
        SaveLoadService.setMobileConfig(this.mobileConfig);

        this.hasChanged = true;

        this.sound.play('SFX1');
    }

    private reset()
    {
        SaveLoadService.setDefaultMobileConfig();

        this.sound.play('SFX1');

        this.scene.restart();
    }

    private quit()
    {
        if (this.hasChanged)
        {
            window.location.reload();
        }
        else
        {
            this.scene.start(SCENES_NAMES.MENU);
        }
    }

    public shutdown(): void
    {
        this.actions.length = 0;
        this.keysText.length = 0;
    }
}