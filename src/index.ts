import Phaser from 'phaser';
import { config } from './phaser-config.js';
import { handleMobile } from './custom/handleMobile.js';

const game = new Phaser.Game(config);

handleMobile(game);
