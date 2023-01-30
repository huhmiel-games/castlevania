/**
 * Gamepad
 * Author: https://github.com/rokobuljan/ 
 */

import { VirtualDomButton } from "./controllers/VirtualDomButton.js";
import { VirtualDomJoystick } from "./controllers/VirtualDomJoystick.js";

const isController = (ob: any) => ob instanceof VirtualDomButton || ob instanceof VirtualDomJoystick;
const DEFAULT_TYPE = "joystick";

class VirtualDomGamepad
{
    controllers: {};
    constructor(controllersArray = [])
    {
        this.controllers = {};
        controllersArray.forEach(options => this.add(options));
    }

    /**
     * Add Controller to Gamepad
     * @param {object|Controller} options controllerOptions or a Button or Joystick Controller instance.
     * @returns Gamepad
     */
    add(...args)
    {
        args.forEach((options) =>
        {
            let controller: { id: string | number; init: () => void; };
            if (isController(options))
            {
                controller = options;
            } 
            else
            {
                options.type = (options.type || DEFAULT_TYPE).trim().toLowerCase();
                controller = new {
                    button: VirtualDomButton,
                    joystick: VirtualDomJoystick,
                }[options.type](options);
            }
            this.controllers[controller.id] = controller;

            // Initialize Controller
            controller.init();
        });

        return this;
    }

    /**
     * Remove/destroy controller by ID
     * @param {string} id Controller ID to remove
     * @returns Gamepad
     */
    remove(...args)
    {
        args.forEach((id) =>
        {
            id = typeof id === "string" ? id : id.id;
            if (this.controllers.hasOwnProperty(id))
            {
                this.controllers[id].destroy();
                delete this.controllers[id];
            }
        });
        return this;
    }

    /**
     * Remove/destroy all controllers (or one by ID)
     * @param {string|Controller} id (Optional) Controller ID
     * @returns Gamepad
     */
    destroy(id: number)
    {
        // Remove one
        if (id) return this.remove(id);
        // Remove all controllers
        Object.keys(this.controllers).forEach((id) => this.remove(id));
        return this;
    }

    /**
     * Call this function to add a listener to request Fullscreen API
     * @returns Gamepad
     */
    requestFullScreen()
    {
        document.querySelector("body")?.addEventListener("click", (evt) =>
        {
            if (!document.fullscreenElement)
            {
                document.documentElement.requestFullscreen();
            }
        });
        return this;
    }

    /**
     * Exit fullScreen
     */
    exitFullScreen()
    {
        if (document.exitFullscreen)
        {
            document.exitFullscreen();
        }
        return this;
    }

    /**
     * Vibrate Gamepad!
     * Use a milliseconds integer or an array of pattern like: [200,30,100,30,200]
     * where 30 is the pause in ms.
     * @param {number|array} vibrationPattern 
     * @returns Gamepad
     */
    vibrate(vibrationPattern)
    {
        if ("navigator" in window) navigator.vibrate(vibrationPattern);
        return this;
    }
}

const DIRECTIONS_4 = ['left', 'right', 'up', 'down'];

const DIRECTIONS_8 = [
    ['right'],
    ['right', 'down'],
    ['down'],
    ['down', 'left'],
    ['left'],
    ['left', 'up'],
    ['up'],
    ['up', 'right'],
];

export { VirtualDomGamepad, VirtualDomButton, VirtualDomJoystick, DIRECTIONS_4, DIRECTIONS_8 };