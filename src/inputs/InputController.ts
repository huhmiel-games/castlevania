import { SCENES_NAMES } from "../constant/config";
import BootScene from "../scenes/BootScene";
import GameScene from "../scenes/GameScene";
import SaveLoadService from "../services/SaveLoadService";
import { TButtons, TKeyMapping } from "../types/types";
import { CustomGamepad } from "./Gamepad";
import { Key } from "./Key";
import { VirtualCanvasGamepad } from "./VirtualCanvasGamepad";

/**
 * Singleton class that handle the global keys/buttons event
 * from keyboard, gamepads, and virtual gamepad.
 */
export class InputController
{
    private static instance: InputController | undefined;
    public scene: Phaser.Scene;
    public isActive: boolean = true;
    public playerAButtons: TButtons;
    public playerBButtons: TButtons;
    public playerCButtons: TButtons;
    public playerDButtons: TButtons;
    private playersButtons: TButtons[] = [];
    private gamepads: CustomGamepad[] = [];
    public savedKeyMapping: TKeyMapping;
    private savedGamepadMapping: TKeyMapping
    private virtualGamepad: VirtualCanvasGamepad;

    private constructor(scene?: Phaser.Scene)
    {
        this.savedKeyMapping = SaveLoadService.getKeyboardMapping();
        this.savedGamepadMapping = SaveLoadService.getGamepadMapping();
        if (scene)
        {
            this.scene = scene;
        }

        // this.keyboardDownEvent = this.keyboardDownEvent.bind(this);
        // this.keyboardUpEvent = this.keyboardUpEvent.bind(this);
    }

    /**
     * Class InputController is a singleton
     * @returns InputController
     */
    public static getInstance(scene?: Phaser.Scene): InputController
    {
        if (InputController.instance == undefined)
        {
            InputController.instance = new InputController(scene);
        }

        if (scene && this.instance)
        {
            this.instance.scene = scene;
        }

        return InputController.instance;
    }

    // #region HANDLE EVENTS
    /**
     * Handle keyboard keys pressed down
     * @param event @type KeyboardEvent
     */
    public keyboardDownEvent(event: KeyboardEvent): void
    {
        if (!this.isActive) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();

        const { playerAButtons } = this;

        const { keyCode } = event;

        const timeStamp = this.scene.time.now;

        const savedKey = Object.keys(this.savedKeyMapping).find(key => this.savedKeyMapping[key] === keyCode);

        if (savedKey !== undefined && playerAButtons[savedKey].isUp)
        {
            playerAButtons[savedKey].setDown(timeStamp);
        }
    }

    /**
     * Handle keyboard keys release
     * @param event @type KeyboardEvent
     */
    public keyboardUpEvent(event: KeyboardEvent): void
    {
        if (!this.isActive) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();

        const { playerAButtons } = this;

        const { keyCode } = event;

        const timeStamp = this.scene.time.now;

        const savedKey = Object.keys(this.savedKeyMapping).find(key => this.savedKeyMapping[key] === keyCode);

        if (savedKey !== undefined && playerAButtons[savedKey].isDown)
        {
            playerAButtons[savedKey].setUp(timeStamp);
        }
    }

    public gamepadAxisUpdate(time: number)
    {
        if (this.gamepads.length === 0 || !this.isActive) return;
        this.gamepads.forEach(function (gamepad)
        {
            gamepad.axisUpdate(time);
        }, this);
    }

    // #endregion

    // #region ADD INPUTS
    public addGamepad(inputGamepad: Phaser.Input.Gamepad.GamepadPlugin)
    {
        const padId = this.gamepads.length + 1;

        let selectedPlayerButtons: TButtons;

        switch (padId)
        {
            case 1:
                if (this.playerAButtons === undefined)
                {
                    this.playerAButtons = this.getNewButtons();
                }

                this.playersButtons.push(this.playerAButtons);
                selectedPlayerButtons = this.playerAButtons;
                break;
            case 2:
                if (this.playerBButtons === undefined)
                {
                    this.playerBButtons = this.getNewButtons();
                }
                this.playersButtons.push(this.playerBButtons);
                selectedPlayerButtons = this.playerBButtons;
                break
            case 3:
                if (this.playerCButtons === undefined)
                {
                    this.playerCButtons = this.getNewButtons();
                }
                this.playersButtons.push(this.playerCButtons);
                selectedPlayerButtons = this.playerCButtons;
                break
            case 4:
                if (this.playerDButtons === undefined)
                {
                    this.playerDButtons = this.getNewButtons();
                }
                this.playersButtons.push(this.playerDButtons);
                selectedPlayerButtons = this.playerDButtons;
            default:
                break;
        }

        const gamepad = new CustomGamepad(padId, inputGamepad[`pad${padId}`], selectedPlayerButtons!);

        this.gamepads.push(gamepad);
    }

    public addVirtualGamepad(scene: BootScene)
    {
        // this.virtualGamepad = new VirtualGamepad(scene);
    }
    // #endregion

    public addPlayerAButtons()
    {
        this.playerAButtons = this.getNewButtons(this.scene);
    }

    public getNewButtons(scene?: Phaser.Scene): TButtons
    {
        return {
            left: new Key('Left', scene),
            right: new Key('Right', scene),
            up: new Key('Up', scene),
            down: new Key('Down', scene),
            x: new Key('x', scene),
            y: new Key('y', scene),
            a: new Key('a', scene),
            b: new Key('b', scene),
            l1: new Key('l1', scene),
            r1: new Key('r1', scene),
            l2: new Key('l2', scene),
            r2: new Key('r2', scene),
            start: new Key('start', scene),
            select: new Key('select', scene)
        }
    }

    public resetButtons()
    {
        for (let button in this.playerAButtons)
        {
            const key: Key = this.playerAButtons[button]
            key.setUp(0);
        }
    }

    public changeConfig()
    {
        this.savedKeyMapping = SaveLoadService.getKeyboardMapping();

        this.savedGamepadMapping = SaveLoadService.getGamepadMapping();

        this.gamepads.forEach(gamepad => gamepad.setIsAxisEnabled());
    }

    get gamepadCount()
    {
        return this.gamepads.length
    }
}