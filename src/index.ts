import Phaser from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import PhaserSceneWatcherPlugin from './plugins/phaser-plugin-scene-watcher.esm.js';

// import rexNinePatchPlugin from './plugins/rexninepatchplugin.min.js';
import { WIDTH, HEIGHT } from './constant/config';
import BootScene from './scenes/BootScene';
import LoadScene from './scenes/LoadScene';
import GameScene from './scenes/GameScene';
import MenuScene from './scenes/MenuScene';
import GameOverScene from './scenes/GameOverScene.js';
import HudScene from './scenes/HudScene.js';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    pixelArt: true,
    autoRound: true,
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
        mode: Phaser.Scale.FIT,
        autoRound: true,
        autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY,
    },
    physics: {
        default: 'arcade',
        arcade: {
            tileBias: 20,
            gravity: { x: 0, y: 1000 },
            debug: false,
            debugShowBody: true,
            debugShowStaticBody: true,
        },
    },
    scene: [BootScene, LoadScene, MenuScene, GameScene, HudScene, GameOverScene],
};

const game = new Phaser.Game(config);

// window.addEventListener('resize', (evt) =>
// {
//     const canva = document.querySelector('canvas');
//     // @ts-ignore
//     const width = evt.currentTarget?.innerWidth;

//     const correctWidth = width - width % 16;

//     const correctHeight = Math.round(correctWidth / 1.7777778);

//     if (canva && correctWidth % 2 === 0 && correctHeight % 2 === 0)
//     {
//         game.scale.setParentSize(correctWidth, correctHeight);
//     }
// });
