import { WIDTH, HEIGHT, isDev } from "./constant/config";
import BootScene from "./scenes/BootScene";
import GameOverScene from "./scenes/GameOverScene";
import GameScene from "./scenes/GameScene";
import HudScene from "./scenes/HudScene";
import LoadScene from "./scenes/LoadScene";
import MenuScene from "./scenes/MenuScene";
import OptionsScene from "./scenes/OptionsScene";
// import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
// import PhaserSceneWatcherPlugin from './plugins/phaser-plugin-scene-watcher.esm.js';
// import rexNinePatchPlugin from './plugins/rexninepatchplugin.min.js';

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    pixelArt: true,
    autoRound: true,
    parent: 'game',
	fullscreenTarget: 'game',
    expandParent: true,
    input: {
        gamepad: true,
        mouse: false,
        windowEvents: false,
    },
    plugins: {
        global: [
            {
                //key: 'SceneWatcher', plugin: PhaserSceneWatcherPlugin, start: true
            },
            {
                // key: 'rexVirtualJoystickPlugin',
                // plugin: VirtualJoystickPlugin,
                // start: true
            }
            // {
            //     key: 'rexNinePatchPlugin',
            //     plugin: rexNinePatchPlugin,
            //     start: true
            // }
        ]
    },
    scale: {
        mode: Phaser.Scale.ScaleModes.FIT,
        autoRound: true,
        autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY,
    },
    physics: {
        default: 'arcade',
        arcade: {
            tileBias: 20,
            gravity: { x: 0, y: 1000 },
            debug: isDev,
            debugShowBody: true,
            debugShowStaticBody: true,
        },
    },
    scene: [BootScene, LoadScene, MenuScene, OptionsScene, GameScene, HudScene, GameOverScene],
};