// GENERAL
export const GAMENAME = 'Castlevania';
export const WIDTH = 256; // 320; // 256; // 384; // 512;
export const HEIGHT = 208; // 176;  // 144;  // 240; // 288;
export const MOBILE_OS = ['android', 'cordova', 'iOS', 'iPad', 'iPhone', 'kindle', 'windowsPhone'];
export const GAMEPAD_AXIS_THRESHOLD = 0.2;

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
    INTRO = 'introScene',
    MENU = 'menuScene',
    GAME = 'gameScene',
    GAMEOVER = 'gameOverScene',
    ENDGAME = 'endGameScene',
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
    SHOTS = 'hud-shots'
}