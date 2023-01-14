import { Boss } from "../custom/enemies/Boss";
import { Enemy } from "../custom/enemies/Enemy";
import { Entity } from "../entities/Entity";
import Boomerang from "../entities/weapons/Boomerang";
import FireBall from "../entities/weapons/FireBall";
import ThrowingAxe from "../entities/weapons/ThrowingAxe";
import ThrowingBomb from "../entities/weapons/ThrowingBomb";
import ThrowingKnife from "../entities/weapons/ThrowingKnife";
import { Key } from "../inputs/Key";
import GameScene from "../scenes/GameScene";

/**
 * Types
 */
export type Tdata = {
    playerRoomName: string,
    x: number,
    y: number
}

export type TWorld = {
    maps: TMap[],
    onlyShowAdjacentMaps: boolean,
    type: "world"
}

export type TMap = {
    fileName: string,
    height: number,
    width: number,
    x: number,
    y: number,
    doors: { x: number, y: number }[]
}
export type TCoord = {
    x: number,
    y: number
}

export type TButtons = {
    left: Key;
    right: Key;
    up: Key;
    down: Key;
    x: Key;
    y: Key;
    a: Key;
    b: Key;
    l1: Key;
    r1: Key;
    l2: Key;
    r2: Key;
    start: Key;
    select: Key;
}

export type TKey = keyof typeof Phaser.Input.Keyboard.KeyCodes;

export type TKeyMapping = {
    left: typeof Phaser.Input.Keyboard.KeyCodes[TKey],
    right: typeof Phaser.Input.Keyboard.KeyCodes[TKey],
    up: typeof Phaser.Input.Keyboard.KeyCodes[TKey],
    down: typeof Phaser.Input.Keyboard.KeyCodes[TKey],
    x: typeof Phaser.Input.Keyboard.KeyCodes[TKey],
    y: typeof Phaser.Input.Keyboard.KeyCodes[TKey],
    a: typeof Phaser.Input.Keyboard.KeyCodes[TKey],
    b: typeof Phaser.Input.Keyboard.KeyCodes[TKey],
    l1: typeof Phaser.Input.Keyboard.KeyCodes[TKey],
    r1: typeof Phaser.Input.Keyboard.KeyCodes[TKey],
    l2: typeof Phaser.Input.Keyboard.KeyCodes[TKey],
    r2: typeof Phaser.Input.Keyboard.KeyCodes[TKey],
    start: typeof Phaser.Input.Keyboard.KeyCodes[TKey],
    select: typeof Phaser.Input.Keyboard.KeyCodes[TKey]
};

export type TVirtualKey = 'x' | 'y' | 'a' | 'b' | 'l1' | 'r1' | 'l2' | 'r2' | 'start' | 'select';

export type TVirtualKeyMapping = {
    x: TVirtualKey,
    y: TVirtualKey,
    a: TVirtualKey,
    b: TVirtualKey,
    l1: TVirtualKey,
    r1: TVirtualKey,
    l2: TVirtualKey,
    r2: TVirtualKey,
    start: TVirtualKey,
    select: TVirtualKey
};

export type TCharacterConfig = {
    scene: GameScene
    x: number
    y: number
    texture: string | Phaser.Textures.Texture
    frame: string | number
    buttons?: TButtons
}

export type TJoystickPosition = {
    joystickX: number,
    joystickY: number
}

export type TDoor = {
    side: string;
    x: number;
    y: number;
};


export type RangedWeapon = Boomerang | ThrowingAxe | ThrowingBomb | ThrowingKnife | FireBall | undefined;

export type TSpriteConfig = {
    scene: GameScene;
    x: number;
    y: number;
    texture: string | Phaser.Textures.Texture;
    frame: string | number;
}

export type BaseItemConfig = {
    scene: GameScene;
    x: number;
    y: number;
    texture: string | Phaser.Textures.Texture;
    frame: string | number;
    quantity: number;
    name?: string
}

export type TileSpriteConfig = {
    scene: GameScene;
    x: number;
    y: number;
    width: number,
    height: number,
    textureKey: string;
    frameKey: string | number;
    parent: Enemy
}

export type TWeaponConfig = {
    scene: GameScene,
    parent: Entity,
    damage: number,
    x: number,
    y: number,
    texture: string,
    frame: string,
    anims: string,
    sound: number,
    group: string
}

export type TAi = {
    button: string; 
    delay: number;
    distance?: number,
    condition: {
        
        x?: string,
        button: string
    }
}

export type TEntityConfig = {
    config: {
        texture: string,
        defaultFrame: string,
        animList: TAnimationList
    },
    status: TStatus,
    physicsProperties: TPhysicsProperties,
    physics: {
        body: {
            width: number,
            height: number,
            offsetX: number,
            offsetY: number
        },
        damageBody: {
            type: 'square' | 'circle',
            width: number,
            height: number,
            offsetY?: number
        }
    },
    state: string[],
    collideWithWorld: boolean,
    secondaryAttackOffsetY?: number,
    alignToPlayer?: boolean,
    withTarget?: string,
    stunWith?: string[],
    resurrect: number
}

export type TSoundList =
{
    [key: string]: Phaser.Sound.BaseSound;
}

export type TStatus =
{
    health: number,
    score: number,
    life: number,
    ammo: number,
    stage: number,
    canTakeStairs: boolean,
    position: TCoord,
}

export type TPhysicsProperties =
{
    gravity: number,
    speed: number,
    maxSpeedY?: number,
    acceleration: number,
    dragCoeff: number,
    stairSpeed?: number,
    isHurt: boolean,
    isDead: boolean,
    isAttacking: boolean,
    isPaused: boolean,
    sinHeight?: number,
    jumpHeight?: number
}

export type TAnimationList =
{
    IDLE?: string | Phaser.Animations.Animation,
    JUMP?: string | Phaser.Animations.Animation,
    BACK_FLIP?: string | Phaser.Animations.Animation,
    CROUCH?: string | Phaser.Animations.Animation,
    LEFT?: string | Phaser.Animations.Animation,
    RIGHT?: string | Phaser.Animations.Animation,
    HURT?: string | Phaser.Animations.Animation,
    DEAD?: string | Phaser.Animations.Animation,
    FALL?: string | Phaser.Animations.Animation,
    UPSTAIR?: string | Phaser.Animations.Animation,
    DOWNSTAIR?: string | Phaser.Animations.Animation,
    ATTACK?: string | Phaser.Animations.Animation,
    SECONDARY_ATTACK?: string | Phaser.Animations.Animation,
    CROUCH_ATTACK?: string | Phaser.Animations.Animation,
    JUMP_ATTACK?: string | Phaser.Animations.Animation,
    JUMP_SECONDARY_ATTACK?: string | Phaser.Animations.Animation,
    UP?: string | Phaser.Animations.Animation,
    DOWN?: string | Phaser.Animations.Animation,
    UPSTAIR_ATTACK?: string | Phaser.Animations.Animation,
    DOWNSTAIR_ATTACK?: string | Phaser.Animations.Animation,
    UPSTAIR_SECONDARY_ATTACK?: string | Phaser.Animations.Animation,
    DOWNSTAIR_SECONDARY_ATTACK?: string | Phaser.Animations.Animation,
    FLY?: string | Phaser.Animations.Animation
}

export type TFrameList =
{
    stairDown: string,
    stairUp: string,
    stairMiddle: string
}

export type TMeleeWeaponConfig = {
    width: number,
    height: number,
    name: string
}

/**
 * Interfaces
 */
export interface IEnemyAI
{
    parent: Enemy | Boss;
    scene: GameScene;
    execute: ()=> void
    reset: () => void
}