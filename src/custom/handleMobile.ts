import { SCENES_NAMES } from "../constant/config";
import BootScene from "../scenes/BootScene";
import { type TMobileConfig, type TButtons } from "../types/types";
import { isMobileOs } from "../utils/isMobileOs";
import { DIRECTIONS_4, DIRECTIONS_8, VirtualDomButton, VirtualDomJoystick } from "../inputs/virtualDomGamepad/VirtualDomGamepad";
import SaveLoadService from "../services/SaveLoadService";

/**
 * Check if mobile, and add a virtual dom gamepad
 * @param game 
 */
export function handleMobile(game: Phaser.Game)
{
    game.events.once(Phaser.Core.Events.READY, checkIsMobile, game);
}

function checkIsMobile(this: Phaser.Game)
{
    const scene = this.scene.getScene(SCENES_NAMES.BOOT) as BootScene;

    if (!isMobileOs(scene))
    {
        return;
    }

    scene.events.on(Phaser.Scenes.Events.UPDATE, waitInputController, scene);
}

function waitInputController(this: BootScene)
{
    if (this.inputController !== undefined && this.inputController.playerAButtons !== undefined)
    {
        this.events.off(Phaser.Scenes.Events.UPDATE, waitInputController);

        if(this.sys.game.device.os.android || this.sys.game.device.os.cordova)
        {
            addVirtualGamepad(this);

            this.scale.startFullscreen();
        }
        else
        {
            this.input.once(Phaser.Input.Events.POINTER_UP, () =>
            {
                addVirtualGamepad(this);
    
                this.scale.startFullscreen();
            });
        }
    }
}

function addVirtualGamepad(scene: BootScene)
{
    const playerButtons = scene.inputController.playerAButtons;

    const mobileConfig = SaveLoadService.getMobileConfig();

    addJoystick(scene, playerButtons, mobileConfig).init();

    addButtonAB(scene, playerButtons, mobileConfig).init();

    addButtonStart(scene, playerButtons, mobileConfig).init();

    addAbButtonBackground();

    addStartButtonBackground();
}

function addJoystick(scene: BootScene, playerButtons: TButtons, mobileConfig: TMobileConfig): VirtualDomJoystick
{
    return new VirtualDomJoystick({
        id: "joystick",
        axis: "all",
        fixed: mobileConfig.joystickStatic,
        parent: "#app-touchArea-left",
        radius: mobileConfig.joystickSize,
        position: mobileConfig.joystickPosition,
        spring: true, // Don't reset (center) joystick on touch-end
        onEnd()
        {
            this.value = 0;
            this.el_handle.style.left = `50%`;
            this.el_handle.style.top = `50%`;

            const { now } = scene.time;

            for (let btn in playerButtons)
            {
                playerButtons[btn].setUp(now);
            }
        },
        onInput()
        {
            let angle = Phaser.Math.Snap.Floor(this.angle_norm! * (180 / Math.PI), 15);

            const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;

            const { now } = scene.time;

            DIRECTIONS_4.forEach(key =>
            {
                if (!DIRECTIONS_8[index].includes(key) && playerButtons[key].isDown)
                {
                    playerButtons[key].setUp(now);
                }
            });

            DIRECTIONS_4.forEach(key =>
            {
                if (DIRECTIONS_8[index].includes(key) && playerButtons[key].isUp && this.value! > 0.4)
                {
                    playerButtons[key].setDown(now);

                    if (mobileConfig.vibration)
                    {
                        window.navigator.vibrate(20);
                    }
                }
            });
        }
    });
}

function addButtonAB(scene: BootScene, playerButtons: TButtons, mobileConfig: TMobileConfig): VirtualDomButton
{
    return new VirtualDomButton({
        id: "btn-ab",
        parent: "#app-touchArea-right",
        spring: false, // Act as a checkbox
        text: "",
        radius: window.innerWidth / 3,
        position: {
            left: "100%",
            top: "100%",
        },
        style: {
            position: 'fixed',
            color: "#fff",
            border: 'none',
            borderRadius: 'none',
            backgroundColor: "none"
        },
        onInput()
        {
            const angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.BetweenPoints({ x: this.x_start, y: this.y_start }, { x: window.innerWidth, y: window.innerHeight });

            const { now } = scene.time;

            if (angle < 45 && playerButtons['a'].isUp)
            {
                playerButtons['a'].setDown(now);
            }

            if (angle > 45 && playerButtons['b'].isUp)
            {
                playerButtons['b'].setDown(now);
            }

            if (mobileConfig.vibration)
            {
                window.navigator.vibrate(20);
            }
        },
        onEnd()
        {
            const angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.BetweenPoints({ x: this.x_start, y: this.y_start }, { x: window.innerWidth, y: window.innerHeight });

            const { now } = scene.time;

            if (angle < 45 && playerButtons['a'].isDown)
            {
                playerButtons['a'].setUp(now)
            }

            if (angle > 45 && playerButtons['b'].isDown)
            {
                playerButtons['b'].setUp(now)
            }
        }
    });
}

function addButtonStart(scene: BootScene, playerButtons: TButtons, mobileConfig: TMobileConfig): VirtualDomButton
{
    return new VirtualDomButton({
        id: "btn-start",
        parent: "#app-touchArea-top-right",
        spring: false, // Act as a checkbox
        text: "",
        radius: Phaser.Math.Clamp(window.innerHeight * window.devicePixelRatio - document.getElementById('btn-ab')?.clientHeight! / 2, 48, window.innerWidth / 3),
        position: {
            right: "0",
            top: "0",
        },
        style: {
            position: 'fixed',
            color: "#fff",
            border: 'none',
            borderRadius: 'none',
            backgroundColor: "none",
        },
        onInput()
        {
            const { now } = scene.time;
            console.log(this, this.radius);
            
            if (playerButtons['start'].isUp)
            {
                playerButtons['start'].setDown(now);

                if(mobileConfig.vibration)
                {
                    window.navigator.vibrate(20);
                }
            }
        },
        onEnd()
        {
            const { now } = scene.time;

            if (playerButtons['start'].isDown)
            {
                playerButtons['start'].setUp(now);
            }
        }
    });
}

function addAbButtonBackground()
{
    const canvas = document.getElementsByTagName('canvas')[0];

    const width = window.innerWidth - canvas.offsetLeft - canvas.offsetWidth;

    const bgAb = document.getElementById('bg-ab') as HTMLDivElement;

    bgAb.style.display = "block";
    bgAb.style.width = width + "px";
    bgAb.style.height = width + "px";
}

function addStartButtonBackground()
{
    const width = document.getElementById('bg-ab')?.clientWidth!;

    const bgStart = document.getElementById('bg-start') as HTMLDivElement;

    bgStart.style.display = "block";
    bgStart.style.width = width + "px";
    bgStart.style.height = width + "px";
}

