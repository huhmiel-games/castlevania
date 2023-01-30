import { TVirtualGamepadOption } from "../../../types/types.js";
import { VirtualDomController } from "./VirtualDomController.js";

/**
 * Gamepad - Button Controller 
 * Author: https://github.com/rokobuljan/ 
 */



export class VirtualDomButton extends VirtualDomController
{
    value: number;
    spring: boolean;
    onInput: () => void;
    constructor(options: TVirtualGamepadOption)
    {
        options.type = "button";
        super(options);
    }

    onStart()
    {
        super.onStart();

        this.value = this.spring ? 1 : this.isActive ? 1 : 0;

        this.onInput();
    }

    onEnd()
    {
        super.onEnd();

        if (!this.spring) return;

        this.value = 0;

        this.onInput();
    }

    init()
    {
        super.init();
    }

    destroy()
    {
        super.destroy();
    }
}
