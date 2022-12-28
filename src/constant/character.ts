export enum EPossibleState
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

export const possibleDirection = [
    EPossibleState.DOWN_LEFT, 
    EPossibleState.DOWN, 
    EPossibleState.DOWN_RIGHT, 
    EPossibleState.LEFT, 
    EPossibleState.IDLE, 
    EPossibleState.RIGHT, 
    EPossibleState.UP_LEFT,
    EPossibleState.UP,
    EPossibleState.UP_RIGHT
]

export const JUMP_MOMENTUM_DELAY = 250;

export const bossNames = ['giant-bat', 'medusa-boss']