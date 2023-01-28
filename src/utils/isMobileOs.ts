import { MOBILE_OS } from "../constant/config";

export function isMobileOs(scene: Phaser.Scene): boolean
{
    let currentOs = '';

    for (let key in scene.sys.game.device.os)
    {
        if (scene.sys.game.device.os[key] === true)
        {
            currentOs = key;
        }
    }

    if (MOBILE_OS.includes(currentOs))
    {
        return true;
    }

    return false;
}
