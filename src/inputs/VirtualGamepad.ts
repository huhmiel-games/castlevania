import VirtualJoyStick from "phaser3-rex-plugins/plugins/input/virtualjoystick/VirtualJoyStick";
import VirtualJoyStickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin";
import { HEIGHT, JOYSTICK_DIRECTION, NOTIF_BASE_ALPHA, NOTIF_BASE_ALPHA_ACTIVE, NOTIF_BASE_SCALE, WIDTH } from "../constant/config";
import BootScene from "../scenes/BootScene";
import SaveLoadService from "../services/SaveLoadService";
import { InputController } from "./InputController";

export class VirtualGamepad
{
    private scene: BootScene;
    public joystick: VirtualJoyStick;
    private inputController: InputController;
    private joystickX: number;
    private joystickY: number;
    constructor (scene: BootScene)
    {
        this.scene = scene;
        this.inputController = InputController.getInstance();
        this.addJoystick();
        this.addButtons();
        this.handleTouchDownEvents = this.handleTouchDownEvents.bind(this);
        this.handleTouchUpEvents = this.handleTouchUpEvents.bind(this);
    }

    /**
     * Add the rexplugin joystick
     */
    private addJoystick (): void
    {
        const virtualJoystickPlugin = this.scene.plugins.get('rexVirtualJoystickPlugin') as VirtualJoyStickPlugin;

        const position = SaveLoadService.getJoystickPosition();

        if (position !== undefined)
        {
            this.joystickX = position.joystickX;
            this.joystickY = position.joystickY;
        }

        this.joystick = virtualJoystickPlugin.add(this.scene, {
            x: this.joystickX,
            y: this.joystickY,
            radius: 32,
            base: this.scene.add.image(0, 0, 'abxy', 4).setDisplaySize(64, 64),
            thumb: this.scene.add.image(0, 0, 'abxy', 5).setDisplaySize(64, 64),
            //@ts-ignore
        }).on('update', this.handleJoyStick, this);

        (this.joystick.base as Phaser.GameObjects.Image).setDepth(2999).setAlpha(0.5);
        (this.joystick.thumb as Phaser.GameObjects.Image).setDepth(3000).setAlpha(0.5);

        this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.handleTouchDownEvents, this);
        this.scene.input.on(Phaser.Input.Events.POINTER_UP, this.handleTouchUpEvents, this);
    }

    /**
     * Add the xyab start select buttons
     */
    private addButtons ()
    {
        const virtualGamepadMapping = SaveLoadService.getVirtualGamepadMapping();

        this.scene.add.image(WIDTH, HEIGHT, 'a-back')
            .setName('a-back')
            .setOrigin(1, 1)
            .setAlpha(NOTIF_BASE_ALPHA)
            .setScale(NOTIF_BASE_SCALE);

        this.scene.add.image(WIDTH, HEIGHT, 'b-back')
            .setName('b-back')
            .setOrigin(1, 1)
            .setAlpha(NOTIF_BASE_ALPHA)
            .setScale(NOTIF_BASE_SCALE);

        this.scene.add.image(WIDTH, HEIGHT, 'x-back')
            .setName('x-back')
            .setOrigin(1, 1)
            .setAlpha(NOTIF_BASE_ALPHA)
            .setScale(NOTIF_BASE_SCALE);

        this.scene.add.image(WIDTH, 0, 'y-back')
            .setName('y-back')
            .setOrigin(1, 0)
            .setAlpha(NOTIF_BASE_ALPHA)
            .setScale(NOTIF_BASE_SCALE);

        const a = this.scene.add.image(WIDTH - 64, HEIGHT - 16, 'abxy', 1).setName(virtualGamepadMapping.a);

        const b = this.scene.add.image(WIDTH - 48, HEIGHT - 48, 'abxy', 3).setName(virtualGamepadMapping.b);

        const x = this.scene.add.image(WIDTH - 16, HEIGHT - 64, 'abxy', 0).setName(virtualGamepadMapping.x);

        const y = this.scene.add.image(WIDTH - 16, 16, 'abxy', 2).setName(virtualGamepadMapping.y);

        const start = this.scene.add.image(WIDTH / 2 + 32, 16, 'abxy', 7)
            .setName(virtualGamepadMapping.start)
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_UP, () =>
            {
                if (this.inputController.playerAButtons.start.isUp)
                {
                    this.handleButtons('start', 'keydown');
                }
                else
                {
                    this.handleButtons('start', 'keyup');
                }
            });

        const select = this.scene.add.image(WIDTH / 2 - 32, 16, 'abxy', 6)
            .setName(virtualGamepadMapping.select)
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_UP, () =>
            {
                if (this.inputController.playerAButtons.select.isUp)
                {
                    this.handleButtons('select', 'keydown');
                }
                else
                {
                    this.handleButtons('select', 'keyup');
                }
            });

        [a, b, x, y, start, select].forEach(button =>
        {
            button.setDepth(3000)
                .setAlpha(0.5)
                .setScrollFactor(0, 0)
                .setDisplaySize(32, 32)
        });
    }

    private setJoystickPosition (x: number, y: number): void
    {
        this.joystick.setPosition(x, y);
    }

    private handleTouchDownEvents (event): void
    {
        event.event.stopPropagation();

        if(!this.inputController.isActive) return;

        const angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.BetweenPoints(event, { x: WIDTH, y: HEIGHT });

        if (event.x > WIDTH / 2 && event.y > HEIGHT / 3 && angle < 33.3)
        {
            this.handleButtons('a', 'keydown');
        }

        if (event.x > WIDTH / 2 && event.y > HEIGHT / 3 && angle < 66.6 && angle > 33.3)
        {
            this.handleButtons('b', 'keydown');
        }

        if (event.x > WIDTH / 2 && event.y > HEIGHT / 3 && angle > 66.6)
        {
            this.handleButtons('x', 'keydown');
        }

        if (event.x > WIDTH / 1.5 && event.y < HEIGHT / 3)
        {
            this.handleButtons('y', 'keydown');
        }
    }

    private handleTouchUpEvents (event): void
    {
        event.event.stopPropagation();

        const downAngle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.BetweenPoints({ x: event.downX, y: event.downY }, { x: WIDTH, y: HEIGHT });

        if (event.downX > WIDTH / 2 && event.downY > HEIGHT / 3 && downAngle < 33.3)
        {
            this.handleButtons('a', 'keyup');
        }

        if (event.downX > WIDTH / 2 && event.downY > HEIGHT / 3 && downAngle < 66.6 && downAngle > 33.3)
        {
            this.handleButtons('b', 'keyup');
        }

        if (event.downX > WIDTH / 2 && event.downY > HEIGHT / 3 && downAngle > 66.6)
        {
            this.handleButtons('x', 'keyup');
        }

        if (event.downX > WIDTH / 3 && event.downY < HEIGHT / 3)
        {
            this.handleButtons('y', 'keyup');
        }
    }

    private handleJoyStick (ev): void
    {
        const { now } = this.scene.time;

        const { playerAButtons } = this.inputController;

        JOYSTICK_DIRECTION.forEach(joyBtn =>
        {
            // joystick pressed
            if (this.joystick[joyBtn] && playerAButtons[joyBtn].isUp)
            {
                playerAButtons[joyBtn].setDown(now);
            }

            // joystick released
            if (!this.joystick[joyBtn] && playerAButtons[joyBtn].isDown)
            {
                playerAButtons[joyBtn].setUp(now);
            }
        });
    }

    private handleButtons (name: string, eventName: 'keydown' | 'keyup'): void
    {
        const { now } = this.scene.time;

        const { playerAButtons } = this.inputController;

        // button pressed
        if (eventName === 'keydown' && playerAButtons[name].isUp)
        {
            playerAButtons[name].setDown(now);
            this.showVisualNotification(name);
        }

        // button released
        if (eventName === 'keyup' && playerAButtons[name].isDown)
        {
            playerAButtons[name].setUp(now);
        }
    }

    private showVisualNotification (name: string): void
    {
        const notif = this.scene.children.getByName(`${name}-back`) as Phaser.GameObjects.Sprite;

        if (!notif) return;

        notif.setAlpha(NOTIF_BASE_ALPHA_ACTIVE);

        this.scene.tweens.add({
            targets: notif,
            alpha: NOTIF_BASE_ALPHA,
            duration: 100
        });
    }
}
