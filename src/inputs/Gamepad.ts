import { GAMEPAD_AXIS_THRESHOLD } from "../constant/config";
import SaveLoadService from "../services/SaveLoadService";
import { TButtons } from "../types/types";
import { InputController } from "./InputController";

export class CustomGamepad
{
    private id: number;
    private gamepad: Phaser.Input.Gamepad.Gamepad
    private savedGamepadMapping = SaveLoadService.getGamepadMapping();
    private inputController: InputController;
    private playerButtons: TButtons;
    private isAxisEnabled: boolean = SaveLoadService.getConfigAxis();

    constructor (id: number, gamepad: Phaser.Input.Gamepad.Gamepad, playerButtons: TButtons)
    {
        this.id = id;

        this.gamepad = gamepad;

        this.inputController = InputController.getInstance();

        this.playerButtons = playerButtons;

        this.isAxisEnabled = SaveLoadService.getConfigAxis();

        this.gamepad?.on(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_DOWN, this.downEvent, this);
        this.gamepad?.on(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_UP, this.upEvent, this);
    }

    /**
     * Handle gamepad buttons press
     * @param button 
     * @param value 
     * @param pad 
     */
    public downEvent(button: number, value: boolean | number, pad: Phaser.Input.Gamepad.Gamepad)
    {
        if(!this.inputController.isActive) return;

        const { playerButtons, savedGamepadMapping } = this;

        const savedKey = Object.keys(savedGamepadMapping).find(key => savedGamepadMapping[key] === button);

        if (savedKey !== undefined && playerButtons[savedKey].isUp)
        {
            playerButtons[savedKey].setDown(this.inputController.scene.time.now);
        }
    }

    /**
     * Handle gamepad buttons release
     * @param button 
     * @param value 
     * @param pad 
     */
    public upEvent(button: number, value: boolean | number, pad: Phaser.Input.Gamepad.Gamepad)
    {
        const { playerButtons, savedGamepadMapping } = this;

        const savedKey = Object.keys(savedGamepadMapping).find(key => savedGamepadMapping[key] === button);

        if (savedKey !== undefined && playerButtons[savedKey].isDown)
        {
            playerButtons[savedKey].setUp(this.inputController.scene.time.now);
        }
    }

    public axisUpdate(timestamp: number)
    {
        if(!this.inputController.isActive) return;

        if (this.gamepad && this.isAxisEnabled && this.gamepad.axes.length)
        {
            const { playerButtons } = this;

            // left gamepad axis
            if (this.gamepad.axes[0].getValue() < -GAMEPAD_AXIS_THRESHOLD && playerButtons.left.isUp)
            {
                playerButtons.left.setDown(timestamp);
            }
            else if (this.gamepad.axes[0].getValue() > -GAMEPAD_AXIS_THRESHOLD && playerButtons.left.isDown)
            {
                playerButtons.left.setUp(timestamp);
            }

            // right gamepad axis
            if (this.gamepad.axes[0].getValue() > GAMEPAD_AXIS_THRESHOLD && playerButtons.right.isUp)
            {
                playerButtons.right.setDown(timestamp);
            }
            else if (this.gamepad.axes[0].getValue() < GAMEPAD_AXIS_THRESHOLD && playerButtons.right.isDown)
            {
                playerButtons.right.setUp(timestamp);
            }

            // up gamepad axis
            if (this.gamepad.axes[1].getValue() < -GAMEPAD_AXIS_THRESHOLD && playerButtons.up.isUp)
            {
                playerButtons.up.setDown(timestamp);
            }
            else if (this.gamepad.axes[1].getValue() > -GAMEPAD_AXIS_THRESHOLD && playerButtons.up.isDown)
            {
                playerButtons.up.setUp(timestamp);
            }

            // down gamepad axis
            if (this.gamepad.axes[1].getValue() > GAMEPAD_AXIS_THRESHOLD && playerButtons.down.isUp)
            {
                playerButtons.down.setDown(timestamp);
            }
            else if (this.gamepad.axes[1].getValue() < GAMEPAD_AXIS_THRESHOLD && playerButtons.down.isDown)
            {
                playerButtons.down.setUp(timestamp);
            }
        }
    }

    public setIsAxisEnabled()
    {
        this.isAxisEnabled = !this.isAxisEnabled;
    }

    public getIsAxisEnabled()
    {
        return this.isAxisEnabled;
    }
}