export enum EStates
{
    UP = 'up',
    UP_LEFT = 'upleft',
    UP_RIGHT = 'upright',
    DOWN = 'down',
    DOWN_LEFT = 'downleft',
    DOWN_RIGHT = 'downright',
    IDLE = 'idle',
    LEFT = 'left',
    RIGHT = 'right',
    RECOIL_LEFT = 'recoil-left',
    RECOIL_RIGHT = 'recoil-right',
    UPSTAIR_LEFT = 'upstairLeft',
    UPSTAIR_RIGHT = 'upstairRight',
    DOWNSTAIR_LEFT = 'downstairLeft',
    DOWNSTAIR_RIGHT = 'downstairRight',
    STAIR_ATTACK = 'stairAttack',
    STAIR_SECONDARY_ATTACK = 'stairSecondaryAttack',
    JUMP = 'jump',
    JUMP_ATTACK = 'jumpAttack',
    JUMP_SECONDARY_ATTACK = 'jumpSecondaryAttack',
    JUMP_MOMENTUM = 'jumpMomentum',
    JUMP_MOMENTUM_ATTACK = 'jumpMomentumAttack',
    JUMP_MOMENTUM_SECONDARY_ATTACK = 'jumpMomentumSecondaryAttack',
    FALL = 'fall',
    FALL_ATTACK = 'fallAttack',
    FALL_SECONDARY_ATTACK = 'fallSecondaryAttack',
    BACK_FLIP = 'backFlip',
    CROUCH = 'crouch',
    ATTACK = 'attack',
    SECONDARY_ATTACK = 'secondaryAttack',
    CROUCH_ATTACK = 'crouchAttack',
    HURT = 'hurt',
    STUN = 'stun',
    DEATH = 'death',
    FLY_LEFT = 'flyLeft',
    FLY_RIGHT = 'flyRight',
    FLY_IDLE = 'flyIdle',
}

export const PLAYER_ATTACK_FRAMES = [
    'richter-attack_2',
    'richter-crouch-attack_2',
    'richter-jump-attack_2',
    'richter-stair-up-attack_2',
    'richter-stair-down-attack_2'
];

export const possibleDirection = [
    EStates.DOWN_LEFT, 
    EStates.DOWN, 
    EStates.DOWN_RIGHT, 
    EStates.LEFT, 
    EStates.IDLE, 
    EStates.RIGHT, 
    EStates.UP_LEFT,
    EStates.UP,
    EStates.UP_RIGHT
]

export const JUMP_MOMENTUM_DELAY = 350;

export enum ENEMY_NAMES {
    ZOMBIE = 'zombie',
    BAT = 'bat',
    BAT_BLUE = 'bat-blue',
    MEDUSA = 'medusa',
    SPEAR_KNIGHT = 'spear-knight',
    CAT = 'cat',
    FISHMAN = 'fishman',
    GHOST = 'ghost',
    DRAGON_HEAD = 'dragonhead',
    SKELETON = 'skeleton',
    SKELETON_RED = 'skeleton-red',
    RAVEN = 'raven',
    EAGLE = 'eagle',
    BONE_DRAGON = 'bone-dragon',
    FLEAMAN = 'fleaman',
    AXE_KNIGHT = 'axe-knight',
    SPIKE = 'spike',
    GIANT_BAT = 'giant-bat',
    MEDUSA_BOSS = 'medusa-boss',
    SNAKE = 'snake',
    MUMMY = 'mummy',
    BANDAGE = 'bandage',
    FRANK= 'frank',
    IGOR = 'igor',
    DEATH = 'death',
    BAT_BRIDGE = 'bat-bridge',
    DRACULA = 'dracula',
    DRACULA_2 = 'dracula2'
}

export const BOSS_NAMES = [
    ENEMY_NAMES.GIANT_BAT as string, 
    ENEMY_NAMES.MEDUSA_BOSS as string, 
    ENEMY_NAMES.MUMMY as string, 
    ENEMY_NAMES.FRANK as string, 
    ENEMY_NAMES.DEATH as string, 
    ENEMY_NAMES.DRACULA as string,
    ENEMY_NAMES.DRACULA_2 as string
];
