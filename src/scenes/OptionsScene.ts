import { Scene } from 'phaser';
import { PALETTE_DB32 } from '../constant/colors';
import { WIDTH, FONTS, FONTS_SIZES, SCENES_NAMES, BUTTONS_NAMES, HEIGHT } from '../constant/config';
import { InputController } from '../inputs/InputController';
import SaveLoadService from '../services/SaveLoadService';
import { TKeyMapping } from '../types/types';

/**
 * @author © Philippe Pereira 2023
 * @export
 * @class OptionsScene
 * @extends {Scene}
 */
export default class OptionsScene extends Scene
{
    inputController: InputController;
    private keyboardMapping: TKeyMapping;
    private keysText: Phaser.GameObjects.BitmapText[] = [];
    private selectedKey0: Phaser.GameObjects.BitmapText;
    private selectedKey1: Phaser.GameObjects.BitmapText;
    private selectedKey2: Phaser.GameObjects.BitmapText;
    private selectedKey3: Phaser.GameObjects.BitmapText;
    private selectedKey4: Phaser.GameObjects.BitmapText;
    private selectedKey5: Phaser.GameObjects.BitmapText;
    private selectedKey6: Phaser.GameObjects.BitmapText;
    private saveText: Phaser.GameObjects.BitmapText;
    private resetText: Phaser.GameObjects.BitmapText;
    private quitText: Phaser.GameObjects.BitmapText;
    private choice: number = 0;
    private icon: Phaser.GameObjects.Sprite;
    private iconPosition: number[];
    private actions: (() => void)[] = [];
    private gamepadMapping: TKeyMapping;
    private selectedButton0: Phaser.GameObjects.BitmapText;
    private selectedButton1: Phaser.GameObjects.BitmapText;
    private selectedButton2: Phaser.GameObjects.BitmapText;
    private selectedButton3: Phaser.GameObjects.BitmapText;
    private selectedButton4: Phaser.GameObjects.BitmapText;
    private selectedButton5: Phaser.GameObjects.BitmapText;
    private selectedButton6: Phaser.GameObjects.BitmapText;
    private isAssigningKey: boolean = false;
    private blinkText: Phaser.GameObjects.BitmapText;
    private tweenBlinkText: Phaser.Tweens.Tween;
    private axisText: Phaser.GameObjects.BitmapText;
    private gamepadDirectionText: Phaser.GameObjects.BitmapText;

    constructor()
    {
        super(SCENES_NAMES.OPTIONS);

        this.inputController = InputController.getInstance();

        this.assignKey = this.assignKey.bind(this);
        this.assignButton = this.assignButton.bind(this);
    }

    public create()
    {
        this.inputController.isActive = false;
        this.input.enabled = true;
        this.input.keyboard!.enabled = true;

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

        this.keyboardMapping = SaveLoadService.getKeyboardMapping();
        this.gamepadMapping = SaveLoadService.getGamepadMapping();

        this.add.image(0, 0, 'background')
            .setOrigin(0, 0);

        this.add.image(0, 0, 'whitePixel').setDisplaySize(WIDTH, HEIGHT).setTintFill(PALETTE_DB32.BLACK).setOrigin(0, 0).setAlpha(0.85);

        this.add.image(WIDTH / 3 + 8, 48, 'items', 'keyboard').setOrigin(0, 0.5);
        this.add.image(WIDTH / 3 * 2 + 8, 48, 'items', 'gamepad').setOrigin(0, 0.5);

        this.add.bitmapText(WIDTH / 2, 16, FONTS.GALAXY, 'options', FONTS_SIZES.GALAXY, 1)
            .setOrigin(0.5, 0.5)
            .setLetterSpacing(2)
            .setTintFill(PALETTE_DB32.WELL_READ);

        this.blinkText = this.add.bitmapText(0, -100, FONTS.GALAXY, '??            ??', FONTS_SIZES.GALAXY, 0);

        this.tweenBlinkText = this.add.tween({
            targets: this.blinkText,
            alpha: {
                from: 1,
                to: 0
            },
            duration: 256,
            yoyo: true,
            repeat: -1
        })

        this.add.bitmapText(WIDTH / 2, 32, FONTS.GALAXY, 'use cursors and enter keys\nto navigate', FONTS_SIZES.GALAXY, 1)
            .setOrigin(0.5, 0.5)
            .setTintFill(PALETTE_DB32.WHITE);

        BUTTONS_NAMES.forEach(btnName =>
        {
            const txt = this.add.bitmapText(WIDTH / 10, 64, FONTS.GALAXY, `${btnName}`, FONTS_SIZES.GALAXY, 0);

            this.keysText.push(txt);

            this.actions.push(this.assignKeyboardOrGamepad)
        });

        this.axisText = this.add.bitmapText(0, 0, FONTS.GALAXY, 'gamepad direction', FONTS_SIZES.GALAXY, 0);
        this.saveText = this.add.bitmapText(0, 0, FONTS.GALAXY, 'save', FONTS_SIZES.GALAXY, 0).setTintFill(PALETTE_DB32.CONIFER);
        this.resetText = this.add.bitmapText(0, 0, FONTS.GALAXY, 'reset', FONTS_SIZES.GALAXY, 0).setTintFill(PALETTE_DB32.WELL_READ);
        this.quitText = this.add.bitmapText(0, 0, FONTS.GALAXY, 'quit', FONTS_SIZES.GALAXY, 0).setTintFill(PALETTE_DB32.EAST_BAY);

        this.keysText.push(this.axisText, this.saveText, this.resetText, this.quitText);

        this.actions.push(this.setGamepadAxis, this.save, this.reset, this.quit);

        Phaser.Actions.AlignTo(this.keysText, Phaser.Display.Align.BOTTOM_LEFT);

        this.iconPosition = this.keysText.map(elm => elm.y);

        this.icon = this.add.sprite(WIDTH / 14, this.iconPosition[this.choice], 'items', 'weapon-holywater_1')
            .setOrigin(0.5, 0.7)
            .play('holy');

        this.selectedKey0 = this.add.bitmapText(WIDTH / 3, 64, FONTS.GALAXY, 'left', FONTS_SIZES.GALAXY, 1);
        this.selectedKey1 = this.add.bitmapText(0, 0, FONTS.GALAXY, 'right', FONTS_SIZES.GALAXY, 1);
        this.selectedKey2 = this.add.bitmapText(0, 0, FONTS.GALAXY, 'up', FONTS_SIZES.GALAXY, 1);
        this.selectedKey3 = this.add.bitmapText(0, 0, FONTS.GALAXY, 'down', FONTS_SIZES.GALAXY, 1);
        this.selectedKey4 = this.add.bitmapText(0, 0, FONTS.GALAXY, 'a', FONTS_SIZES.GALAXY, 1);
        this.selectedKey5 = this.add.bitmapText(0, 0, FONTS.GALAXY, 'b', FONTS_SIZES.GALAXY, 1);
        this.selectedKey6 = this.add.bitmapText(0, 0, FONTS.GALAXY, 'start', FONTS_SIZES.GALAXY, 1);

        Phaser.Actions.AlignTo([
            this.selectedKey0,
            this.selectedKey1,
            this.selectedKey2,
            this.selectedKey3,
            this.selectedKey4,
            this.selectedKey5,
            this.selectedKey6,
        ], Phaser.Display.Align.BOTTOM_LEFT);


        this.selectedButton0 = this.add.bitmapText(WIDTH / 3 * 2, 64, FONTS.GALAXY, 'left', FONTS_SIZES.GALAXY, 1).setTintFill(PALETTE_DB32.WELL_READ);
        this.selectedButton1 = this.add.bitmapText(0, 0, FONTS.GALAXY, 'right', FONTS_SIZES.GALAXY, 1).setTintFill(PALETTE_DB32.WELL_READ);
        this.selectedButton2 = this.add.bitmapText(0, 0, FONTS.GALAXY, 'up', FONTS_SIZES.GALAXY, 1).setTintFill(PALETTE_DB32.WELL_READ);
        this.selectedButton3 = this.add.bitmapText(0, 0, FONTS.GALAXY, 'down', FONTS_SIZES.GALAXY, 1).setTintFill(PALETTE_DB32.WELL_READ);
        this.selectedButton4 = this.add.bitmapText(0, 0, FONTS.GALAXY, 'a', FONTS_SIZES.GALAXY, 1);
        this.selectedButton5 = this.add.bitmapText(0, 0, FONTS.GALAXY, 'b', FONTS_SIZES.GALAXY, 1);
        this.selectedButton6 = this.add.bitmapText(0, 0, FONTS.GALAXY, 'start', FONTS_SIZES.GALAXY, 1);
        this.gamepadDirectionText = this.add.bitmapText(0, 0, FONTS.GALAXY, '', FONTS_SIZES.GALAXY, 1);
        SaveLoadService.getConfigAxis() === true ? this.gamepadDirectionText.setText('axis') : this.gamepadDirectionText.setText('d-pad'),

        Phaser.Actions.AlignTo([
            this.selectedButton0,
            this.selectedButton1,
            this.selectedButton2,
            this.selectedButton3,
            this.selectedButton4,
            this.selectedButton5,
            this.selectedButton6,
            this.gamepadDirectionText
        ], Phaser.Display.Align.BOTTOM_LEFT);


        BUTTONS_NAMES.forEach((btnName, i) =>
        {
            const key = Object.keys(Phaser.Input.Keyboard.KeyCodes)
                .filter(key => Phaser.Input.Keyboard.KeyCodes[key] === this.keyboardMapping[btnName])[0];

            this[`selectedKey${i}`].text = key.toLowerCase();
        });

        // fading the scene from black
        this.cameras.main.fadeIn(500);

        this.input.keyboard?.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, (event) =>
        {
            if (this.isAssigningKey) return;

            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN)
            {
                this.choice = Phaser.Math.Wrap(this.choice + 1, 0, this.keysText.length);

                this.icon.setPosition(this.icon.x, this.iconPosition[this.choice]);
            }

            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.UP)
            {
                this.choice = Phaser.Math.Wrap(this.choice - 1, 0, this.keysText.length);

                this.icon.setPosition(this.icon.x, this.iconPosition[this.choice]);
            }

            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER)
            {
                this.actions[this.choice].call(this);
            }
        });

    }

    private setGamepadAxis()
    {
        const axis = SaveLoadService.getConfigAxis();

        SaveLoadService.setConfigAxis(!axis);

        this.inputController.changeConfig();

        if (axis === true)
        {
            this.gamepadDirectionText.setText('d-pad')
        }
        else
        {
            this.gamepadDirectionText.setText('axis')
        }
    }

    private save()
    {
        SaveLoadService.setKeyboardMapping(this.keyboardMapping);

        this.inputController.changeConfig();

        this.sound.play('SFX1');
    }

    private reset()
    {
        SaveLoadService.setDefaultKeyboardMapping();

        this.inputController.changeConfig();

        this.sound.play('SFX1');

        this.scene.restart();
    }

    private quit()
    {
        this.scene.start(SCENES_NAMES.MENU);
    }

    private assignKeyboardOrGamepad()
    {
        this[`selectedKey${this.choice}`].setAlpha(0);
        this[`selectedButton${this.choice}`].setAlpha(0);

        this.showBlink();

        this.isAssigningKey = true;

        this.input.keyboard?.once(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this.assignKey);

        this.input.gamepad?.once(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_DOWN, this.assignButton);
    }

    private assignKey(e: { key: string, keyCode: number; })
    {
        this.keyboardMapping[BUTTONS_NAMES[this.choice]] = e.keyCode;

        this.maskBlink();

        this[`selectedKey${this.choice}`].setAlpha(1).text = e.key.toLowerCase();

        this[`selectedButton${this.choice}`].setAlpha(1);

        this.input.gamepad?.off(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_DOWN, this.assignButton, undefined, true);

        this.isAssigningKey = false;
    }

    private assignButton(gamepad: Gamepad, button: GamepadButton)
    {
        // prevent changing D-PAD
        if (this.choice < 4)
        {
            this.maskBlink();

            this[`selectedKey${this.choice}`].setAlpha(1);

            this[`selectedButton${this.choice}`].setAlpha(1);

            this.input.keyboard?.off(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this.assignKey, undefined, true);

            return;
        }
        // @ts-ignore
        this.gamepadMapping[BUTTONS_NAMES[this.choice]] = button.index!;

        this.isAssigningKey = false;

        for (let key in gamepad)
        {
            if (typeof gamepad[key] === typeof Boolean() && gamepad[key] === true && gamepad[key] !== 'connected')
            {
                this.maskBlink();

                this[`selectedButton${this.choice}`].setAlpha(1).text = key.toLowerCase();

                this[`selectedKey${this.choice}`].setAlpha(1);

                this.input.keyboard?.off(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this.assignKey, undefined, true);
            }
        }
    }


    private showBlink()
    {
        this.blinkText.setPosition(WIDTH / 3, this.keysText[this.choice].y);
    }

    private maskBlink()
    {
        this.blinkText.setPosition(WIDTH / 3, -100);
    }

    public shutdown(): void
    {
        this.actions.length = 0;
        this.keysText.length = 0;

        this.tweenBlinkText.stop();

        this.input.keyboard?.off(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN);
    }
}