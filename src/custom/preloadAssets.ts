import { ATLAS_NAMES, PLAYERS_NAMES } from "../constant/config";

export default function preloadAssets(scene: Phaser.Scene)
{
    scene.load.atlas(PLAYERS_NAMES.A, './assets/graphics/atlas/simon.png', './assets/graphics/atlas/simon.json');
    scene.load.atlas(PLAYERS_NAMES.B, './assets/graphics/atlas/richter.png', './assets/graphics/atlas/richter.json');
    scene.load.atlas(ATLAS_NAMES.ITEMS, './assets/graphics/atlas/items.png', './assets/graphics/atlas/items.json');
    scene.load.atlas(ATLAS_NAMES.ENEMIES, './assets/graphics/atlas/enemies.png', './assets/graphics/atlas/enemies.json'); 

    scene.load.spritesheet('health', './assets/graphics/hud/health-3x8.png', { frameWidth: 3, frameHeight: 7 });
    scene.load.image('weaponFrame', './assets/graphics/hud/weapon-frame.png');
    scene.load.image('heart', './assets/graphics/hud/heart.png');
    scene.load.image('thunder', './assets/graphics/backgrounds/thunder.png');

    scene.load.image('colliderTileset', './assets/graphics/tilesets/colliderTileset_extruded.png');
    scene.load.image('main', './assets/graphics/tilesets/main_extruded.png');
    scene.load.image('rob-candles', './assets/graphics/tilesets/rob-candles_extruded.png');
    scene.load.image('dark-background', './assets/graphics/tilesets/dark-background_extruded.png');
    scene.load.image('back-moon', './assets/graphics/backgrounds/back-moon.png');
    scene.load.image('back-mountain', './assets/graphics/backgrounds/back-mountain.png');
    scene.load.image('back-castle', './assets/graphics/backgrounds/back-castle3.png');
    scene.load.image('back-castle-entrance', './assets/graphics/backgrounds/back-castle-entrance.png');
    scene.load.image('back-castle-entrance-front', './assets/graphics/backgrounds/back-castle-entrance-front.png');
    scene.load.image('back-clock', './assets/graphics/backgrounds/back-clock.png');


    scene.load.tilemapTiledJSON('map1', './assets/maps/map1.json')
    scene.load.json('mapWorld', './assets/maps/world.world');

    scene.load.audio('0', './assets/sounds/1 - Introduction (Castle Gate).ogg')
    scene.load.audio('1', './assets/sounds/2 - Vampire Killer (Courtyard).ogg')
    scene.load.audio('2', './assets/sounds/3 - Stalker (Armory).ogg')
    scene.load.audio('3', './assets/sounds/4 - Wicked Child (Upper Yard).ogg')
    scene.load.audio('4', './assets/sounds/5 - Walking Edge (Castle Swamp).ogg')
    scene.load.audio('5', './assets/sounds/6 - Heart of Fire (Prisonhold).ogg')
    scene.load.audio('6', './assets/sounds/7 - Out of Time (Upper Terrace).ogg')
    scene.load.audio('7', './assets/sounds/8 - Nightmare (Dracula\'s Quarters).ogg')
    scene.load.audio('8', './assets/sounds/9 - Poison Mind (Boss Theme).ogg')
    scene.load.audio('9', './assets/sounds/10 - Black Night (Final Battle).ogg')
    scene.load.audio('10', './assets/sounds/11 - Victory.ogg')
    scene.load.audio('11', './assets/sounds/12 - Game Complete.ogg')
    scene.load.audio('12', './assets/sounds/14 - Death.ogg')
    scene.load.audio('13', './assets/sounds/13 - Voyager (Ending).ogg')
    scene.load.audio('14', './assets/sounds/15 - Game Over.ogg')
    scene.load.audio('15', './assets/sounds/16 - Track 16.ogg')
    scene.load.audio('SFX1', './assets/sounds/SFX1.ogg')
    scene.load.audio('SFX2', './assets/sounds/SFX2.ogg')
    scene.load.audio('SFX3', './assets/sounds/SFX3.ogg')
    scene.load.audio('SFX4', './assets/sounds/SFX4.ogg')
    scene.load.audio('SFX5', './assets/sounds/SFX5.ogg')
    scene.load.audio('SFX6', './assets/sounds/SFX6.ogg')
    scene.load.audio('SFX7', './assets/sounds/SFX7.ogg')
    scene.load.audio('SFX8', './assets/sounds/SFX8.ogg')
    scene.load.audio('SFX9', './assets/sounds/SFX9.ogg')
    scene.load.audio('SFX10', './assets/sounds/SFX10.ogg')
    scene.load.audio('SFX11', './assets/sounds/SFX11.ogg')
    scene.load.audio('SFX12', './assets/sounds/SFX12.ogg')
    scene.load.audio('SFX13', './assets/sounds/SFX13.ogg')
    scene.load.audio('SFX14', './assets/sounds/SFX14.ogg')
    scene.load.audio('SFX15', './assets/sounds/SFX15.ogg')
    scene.load.audio('SFX16', './assets/sounds/SFX16.ogg')
    scene.load.audio('SFX17', './assets/sounds/SFX17.ogg')
    scene.load.audio('SFX18', './assets/sounds/SFX18.ogg')
    scene.load.audio('SFX19', './assets/sounds/SFX19.ogg')
    scene.load.audio('SFX20', './assets/sounds/SFX20.ogg')
    scene.load.audio('SFX21', './assets/sounds/SFX21.ogg')
    scene.load.audio('SFX22', './assets/sounds/SFX22.ogg')
    scene.load.audio('SFX23', './assets/sounds/SFX23.ogg')
    scene.load.audio('SFX24', './assets/sounds/SFX24.ogg')
    scene.load.audio('SFX25', './assets/sounds/SFX25.ogg')
    scene.load.audio('SFX26', './assets/sounds/SFX26.ogg')
    scene.load.audio('SFX27', './assets/sounds/SFX27.ogg')
    scene.load.audio('SFX28', './assets/sounds/SFX28.ogg')
    scene.load.audio('SFX29', './assets/sounds/SFX29.ogg')
    scene.load.audio('SFX30', './assets/sounds/SFX30.ogg')
    scene.load.audio('SFX31', './assets/sounds/SFX31.ogg')
    scene.load.audio('SFX32', './assets/sounds/SFX32.ogg')
    scene.load.audio('SFX33', './assets/sounds/SFX33.ogg')
    scene.load.audio('SFX34', './assets/sounds/SFX34.ogg')
    scene.load.audio('SFX35', './assets/sounds/SFX35.ogg')
    scene.load.audio('SFX36', './assets/sounds/SFX36.ogg')
    scene.load.audio('SFX37', './assets/sounds/SFX37.ogg')
    scene.load.audio('SFX38', './assets/sounds/SFX38.ogg')
}