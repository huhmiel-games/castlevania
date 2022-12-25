import { GAMENAME, HEIGHT, WIDTH } from "../constant/config";
import { TJoystickPosition, TKeyMapping, TStatus, TVirtualKeyMapping, TWorld } from "../types/types";
import GameScene from '../scenes/GameScene';

/**
 * @description Save or Load from localStorage
 * @author © Philippe Pereira 2022
 * @export
 * @class SaveLoadService
 */
export default class SaveLoadService
{
    // #region GAME DATA
    /**
     * Set a new game data on localstorage
     */
    public static saveNewGameData(data: TStatus): void
    {
        try
        {
            localStorage.setItem(`${GAMENAME}_data`, JSON.stringify(data));

            localStorage.setItem(`${GAMENAME}_time`, JSON.stringify(0));

            localStorage.setItem(`${GAMENAME}_world`, JSON.stringify({}));
        }
        catch (error)
        {
            // console.log(error);
        }
    }

    /**
     * Save the world
     * @param world 
     */
    public static saveWorld(world: TWorld)
    {
        try
        {
            localStorage.setItem(`${GAMENAME}_world`, JSON.stringify(world));
        }
        catch (error)
        {
            throw new Error(error as string);
        }
    }

    public static getWorld(): TWorld
    {
        const worldJson = localStorage.getItem(`${GAMENAME}_world`);

        return JSON.parse(worldJson || '{}');
    }

    /**
     * Save the game data on localstorage
     */
    public static saveGameData(status: TStatus): void
    {
        const dataJson = JSON.stringify(status);

        localStorage.setItem(`${GAMENAME}_data`, dataJson);
    }

    /**
     * Load the game data from localStorage
     */
    public static loadGameData()
    {
        try
        {
            return localStorage.getItem(`${GAMENAME}_data`);
        }
        catch (error)
        {
            throw new Error(error as string);
        }
    }

    /**
     * Delete the saved game
     */
    public static deleteGameData(): void
    {
        localStorage.removeItem(`${GAMENAME}_data`);
        localStorage.removeItem(`${GAMENAME}_time`);
        localStorage.removeItem(`${GAMENAME}_playerDeathCount`);
        localStorage.removeItem(`${GAMENAME}_enemiesDeathCount`);
        localStorage.removeItem(`${GAMENAME}_bossDeath`);
    }
    // #endregion

    // #region TIME
    /**
     * Return the saved game time to string
     */
    public static getSavedGameTimeToString()
    {
        const storedTime = SaveLoadService.getSavedGameTime() / 1000;

        if (storedTime !== null)
        {
            const hours = Math.floor(storedTime / 3600);
            const minutes = Math.floor(storedTime / 60) % 60;
            const seconds = Math.floor(storedTime % 60);

            return [hours, minutes, seconds]
                .map(v => v < 10 ? '0' + v : v)
                .join(':');
        }
    }
    /**
     * Return the saved game time in seconds
     */
    public static getSavedGameTime()
    {
        const s: string | null = localStorage.getItem(`${GAMENAME}_time`);

        if (s !== null)
        {
            return Number(s);
        }

        return 0;
    }
    /**
     * Save the total time on game
     * @param scene
     */
    public static setSavedGameTime(scene: GameScene): void
    {
        const timestampNow = new Date().getTime();

        const currentSessionTime: number = timestampNow - scene.firstTimestamp;

        const pastSessionTime: number = SaveLoadService.getSavedGameTime();

        localStorage.setItem(`${GAMENAME}_time`, JSON.stringify(pastSessionTime + currentSessionTime));

        SaveLoadService.resetSceneFirstTimeStamp(scene);
    }
    /**
     * Reset the scene timestamp
     * @param scene
     */
    public static resetSceneFirstTimeStamp(scene: GameScene): void
    {
        scene.firstTimestamp = new Date().getTime();
    }
    // #endregion

    // #region COUNT
    public static setDeadBoss(scene: GameScene, bossId: number): void
    {
        if (!localStorage.getItem(`${GAMENAME}_bossDeath`))
        {
            localStorage.setItem(`${GAMENAME}_bossDeath`, JSON.stringify([]));
        }

        const deadBosses = this.getDeadBoss(scene);

        if (deadBosses)
        {
            deadBosses.push(bossId);

            localStorage.setItem(`${GAMENAME}_bossDeath`, JSON.stringify(deadBosses));
        }
    }
    public static resetDeadBoss(): void
    {
        localStorage.removeItem(`${GAMENAME}_bossDeath`);
    }
    public static getDeadBoss(scene: GameScene): number[]
    {
        const deadBosses: string | null = localStorage.getItem(`${GAMENAME}_bossDeath`);

        if (deadBosses !== null)
        {
            return JSON.parse(deadBosses);
        }

        return [];
    }
    public static setPlayerDeathCount()
    {
        let playerDeathCount = this.getPlayerDeathCount();

        playerDeathCount += 1;

        localStorage.setItem(`${GAMENAME}_playerDeathCount`, JSON.stringify(playerDeathCount));
    }
    public static getPlayerDeathCount(): number
    {
        const playerDeathCount: string | null = localStorage.getItem(`${GAMENAME}_playerDeathCount`);

        if (playerDeathCount !== null)
        {
            return JSON.parse(playerDeathCount);
        }

        return 0;
    }

    public static async setEnemiesDeathCount()
    {
        let enemiesDeathCount = await this.getEnemiesDeathCount();

        enemiesDeathCount += 1;

        localStorage.setItem(`${GAMENAME}_enemiesDeathCount`, JSON.stringify(enemiesDeathCount));
    }

    public static getEnemiesDeathCount(): number
    {
        const enemiesDeathCount: string | null = localStorage.getItem(`${GAMENAME}_enemiesDeathCount`);

        if (enemiesDeathCount !== null)
        {
            return JSON.parse(enemiesDeathCount);
        }

        return 0;
    }
    // #endregion

    // #region KEYBOARD
    /**
     * Get keyboard mapping from localStorage.
     * If not present, return the default keyboard mapping
     */
    public static getKeyboardMapping(): TKeyMapping
    {
        const storedKeys: string | null = localStorage.getItem(`${GAMENAME}_KEYBOARD_MAPPING`);

        if (storedKeys !== null)
        {
            return JSON.parse(storedKeys);
        }
        else
        {
            return this.setDefaultKeyboardMapping();
        }
    }

    /**
     * Store default keyboard mapping to localStorage
     */
    public static setDefaultKeyboardMapping(): TKeyMapping
    {
        const keys: TKeyMapping = {
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            x: Phaser.Input.Keyboard.KeyCodes.X,
            y: Phaser.Input.Keyboard.KeyCodes.Y,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            b: Phaser.Input.Keyboard.KeyCodes.B,
            l1: Phaser.Input.Keyboard.KeyCodes.L,
            r1: Phaser.Input.Keyboard.KeyCodes.M,
            l2: Phaser.Input.Keyboard.KeyCodes.O,
            r2: Phaser.Input.Keyboard.KeyCodes.P,
            start: Phaser.Input.Keyboard.KeyCodes.ENTER,
            select: Phaser.Input.Keyboard.KeyCodes.SPACE
        };

        if (!localStorage.getItem(`${GAMENAME}_KEYBOARD_MAPPING`))
        {
            const keysToString = JSON.stringify(keys);

            localStorage.setItem(`${GAMENAME}_KEYBOARD_MAPPING`, keysToString);
        }

        return keys;
    }

    /**
     * Store custom keyboard mapping to localStorage
     */
    public static setKeyboardMapping(mapping: TKeyMapping): void
    {
        const mappingJson = JSON.stringify(mapping);

        localStorage.setItem(`${GAMENAME}_KEYBOARD_MAPPING`, mappingJson);
    }

    /**
     * Delete keyboard mapping from localstorage
     */
    public static deleteKeyboardMapping(): void
    {
        localStorage.removeItem(`${GAMENAME}_KEYBOARD_MAPPING`);
    }
    // #endregion

    // #region GAMEPAD
    /**
     * Get gamepad mapping from localStorage.
     * If not present, return the default gamepad mapping
     */
    public static getGamepadMapping(): TKeyMapping
    {
        const gamepadMapping: string | null = localStorage.getItem(`${GAMENAME}_GAMEPAD_MAPPING`);

        if (gamepadMapping !== null)
        {
            return JSON.parse(gamepadMapping);
        }
        else
        {
            const newGamepadMapping = this.setDefaultGamepadMapping();

            return newGamepadMapping;
        }
    }

    /**
     * Store default gamepad mapping to localStorage
     */
    public static setDefaultGamepadMapping(): TKeyMapping
    {
        const gamepadMapping: TKeyMapping = {
            left: 14,
            right: 15,
            up: 12,
            down: 13,
            x: 2,
            y: 3,
            a: 0,
            b: 1,
            l1: 4,
            r1: 5,
            l2: 6,
            r2: 7,
            start: 9,
            select: 8
        };

        if (!localStorage.getItem(`${GAMENAME}_GAMEPAD_MAPPING`))
        {
            const gamepadMappingJson = JSON.stringify(gamepadMapping);

            localStorage.setItem(`${GAMENAME}_GAMEPAD_MAPPING`, gamepadMappingJson);
            localStorage.setItem(`${GAMENAME}_GAMEPAD_AXIS`, 'false');
        }

        return gamepadMapping;
    }

    /**
     * Store custom gamepad mapping to localStorage
     */
    public static setGamepadMapping(mapping: TKeyMapping): void
    {
        const mappingJson = JSON.stringify(mapping);

        localStorage.setItem(`${GAMENAME}_GAMEPAD_MAPPING`, mappingJson);
    }

    /**
     * Delete gamepad mapping from localstorage
     */
    public static deleteConfigButtons(): void
    {
        localStorage.removeItem(`${GAMENAME}_GAMEPAD_MAPPING`);
    }

    /**
     * Get gamepad axis config
     */
    public static getConfigAxis(): boolean
    {
        const storedKeys: string | null = localStorage.getItem(`${GAMENAME}_GAMEPAD_AXIS`);

        if (storedKeys !== null)
        {
            const axis = JSON.parse(storedKeys);

            return axis;
        }

        return false;
    }

    /**
     * Set gamepad axis config
     * @param value boolean
     */
    public static setConfigAxis(value: boolean): void
    {
        const str = JSON.stringify(value);

        localStorage.setItem(`${GAMENAME}_GAMEPAD_AXIS`, str);
    }
    // #endregion

    // #region VIRTUAL GAMEPAD
    /**
     * Get virtual gamepad mapping from localStorage.
     * If not present, return the default virtual gamepad mapping
     */
    public static getVirtualGamepadMapping(): TVirtualKeyMapping
    {
        const storedKeys: string | null = localStorage.getItem(`${GAMENAME}_VIRTUAL_GAMEPAD_MAPPING`);

        if (storedKeys !== null)
        {
            return JSON.parse(storedKeys);
        }
        else
        {
            return this.setDefaultVirtualGamepadMapping();
        }
    }

    /**
     * Store default virtual gamepad mapping to localStorage
     */
    public static setDefaultVirtualGamepadMapping(): TVirtualKeyMapping
    {
        const virtualGamepadMapping: TVirtualKeyMapping = {
            x: 'x',
            y: 'y',
            a: 'a',
            b: 'b',
            l1: 'l1',
            r1: 'r1',
            l2: 'l2',
            r2: 'r2',
            start: 'start',
            select: 'select'
        };

        if (!localStorage.getItem(`${GAMENAME}_VIRTUAL_GAMEPAD_MAPPING`))
        {
            const virtualGamepadMappingJson = JSON.stringify(virtualGamepadMapping);

            localStorage.setItem(`${GAMENAME}_VIRTUAL_GAMEPAD_MAPPING`, virtualGamepadMappingJson);
        }

        return virtualGamepadMapping;
    }

    /**
     * Store custom virtual gamepad mapping to localStorage
     */
    public static setVirtualGamepadMapping(mapping: TVirtualKeyMapping): void
    {
        const mappingJson = JSON.stringify(mapping);

        localStorage.setItem(`${GAMENAME}_VIRTUAL_GAMEPAD_MAPPING`, mappingJson);
    }

    /**
     * Delete virtual gamepad mapping from localstorage
     */
    public static deleteVirtualGamepadMapping(): void
    {
        localStorage.removeItem(`${GAMENAME}_VIRTUAL_GAMEPAD_MAPPING`);
    }

    /**
     * Store virtual joystick position
     * @param position 
     */
    public static setJoystickPosition(position: TJoystickPosition)
    {
        const positionJson = JSON.stringify(position);

        localStorage.setItem(`${GAMENAME}_VIRTUAL_GAMEPAD_JOYSTICK_POSITION`, positionJson);
    }

    /**
     * Get virtual joystick position
     * @returns 
     */
    public static getJoystickPosition(): TJoystickPosition
    {
        const position: string | null = localStorage.getItem(`${GAMENAME}_VIRTUAL_GAMEPAD_JOYSTICK_POSITION`);

        if (position !== null)
        {
            return JSON.parse(position) as TJoystickPosition;
        }
        else
        {
            this.setJoystickPosition({ joystickX: WIDTH / 8, joystickY: HEIGHT / 8 * 6 });

            return { joystickX: WIDTH / 8, joystickY: HEIGHT / 8 * 6 } as TJoystickPosition;
        }
    }
    // #endregion
}
