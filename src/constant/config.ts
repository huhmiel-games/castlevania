// GENERAL
export const isDev = false; // true for state logs, body debugs, l to save everywhere, y to delete gamedata
export const GAMENAME = 'Castlevania';
export const WIDTH = 256;
export const HEIGHT = 208;
export const MOBILE_OS = ['android', 'cordova', 'iOS', 'iPad', 'iPhone', 'kindle', 'windowsPhone'];
export const GAMEPAD_AXIS_THRESHOLD = 0.6;
export const BUTTONS_NAMES = ['left', 'right', 'up', 'down', 'a', 'b', 'start'];
export enum BTN_EVENTS {
    A_DOWN = 'a_DownEvent',
    B_DOWN = 'b_DownEvent',
    START_DOWN = 'start_DownEvent',
    UP_DOWN = 'Up_DownEvent',
    DOWN_DOWN = 'Down_DownEvent',
    LEFT_DOWN = 'Left_DownEvent',
    RIGHT_DOWN = 'Right_DownEvent',
    A_UP = 'a_UpEvent',
    B_UP = 'b_UpEvent',
    START_UP = 'start_UpEvent',
    UP_UP = 'Up_UpEvent',
    DOWN_UP = 'Down_UpEvent',
    LEFT_UP = 'Left_UpEvent',
    RIGHT_UP = 'Right_UpEvent',
}

// MAP
export const TILE_SIZE = 16;
export const MOVING_PLATFORM_SPEED = 32;
export const TILED_WORLD_OFFSET_Y = 32;
export const STAGE_BACKTRACK = [13, 62];

// Players names
export const PLAYER_A_NAME = 'playerA';
export const PLAYER_B_NAME = 'playerB';
export const PLAYER_C_NAME = 'playerC';
export const PLAYER_D_NAME = 'playerD';

// Lights
export const LIGHT_RADIUS = 24;
export const LIGHT_INTENSITY = 0.05;
export const LIGHT_ATTENUATION = 0.125;
export const LIGHT_ATTENUATION_START = 0.120;
export const LIGHT_ATTENUATION_END = 0.125;
export const LIGHT_COLOR = 0xd9a066;

// VIRTUAL GAMEPAD
export const JOYSTICK_DIRECTION = ['up', 'down', 'left', 'right'];
export const NOTIF_BASE_ALPHA = 0.2;
export const NOTIF_BASE_ALPHA_ACTIVE = 0.5;
export const NOTIF_BASE_SCALE = 1.3;

// FONTS
export const enum FONTS
{
    GALAXY = 'galaxy',
}

export const enum FONTS_SIZES
{
    GALAXY = 8,
}

// SCENES
export const enum SCENES_NAMES
{
    BOOT = 'bootScene',
    LOAD = 'loadScene',
    MENU = 'menuScene',
    GAME = 'gameScene',
    GAMEOVER = 'gameOverScene',
    OPTIONS = 'optionsScene',
    HUD = 'hudScene'
}

export const enum HUD_EVENTS_NAMES
{
    HEALTH = 'hud-health',
    HEART = 'hud-heart',
    SCORE = 'hud-score',
    LIFE = 'hud-life',
    STAGE = 'hud-stage',
    WEAPON = 'hud-weapon',
    RESET = 'hud-reset',
    SHOTS = 'hud-shots',
    BOSS_HEALTH = 'hud-boss-health'
}

export const enum ATLAS_NAMES
{
    PLAYER = 'atlas',
    ENEMIES = 'enemies',
    ITEMS = 'items'
}

export const STAGE_START_POSITION = {
    '11': { x:   2 * TILE_SIZE, y: 69 * TILE_SIZE },
    '21': { x: 225 * TILE_SIZE, y: 65 * TILE_SIZE },
    '31': { x: 110 * TILE_SIZE, y: 30 * TILE_SIZE },
    '41': { x: 277 * TILE_SIZE, y: 74 * TILE_SIZE },
    '51': { x: 527 * TILE_SIZE, y: 67 * TILE_SIZE },
    '61': { x: 478 * TILE_SIZE, y: 34 * TILE_SIZE },
    '71': { x: 334 * TILE_SIZE, y: 19 * TILE_SIZE },
}

export const STAGE_COUNTDOWN_DEFAULT = 300;
export const STAGE_COUNTDOWN = {
    '11': 300,
    '21': 400,
    '31': 500,
    '41': 400,
    '51': 500,
    '61': 700,
}


export const COUNTDOWN_EVENT = 'countdown-event';
