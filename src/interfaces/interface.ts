import { Enemy } from "../entities/enemies/Enemy";
import GameScene from "../scenes/GameScene";
import { TCoord } from "../types/types";

/**
 * The Handler interface declares a method for building the chain of handlers.
 * It also declares a method for executing a request.
 */
export interface Handler
{
    setNext (handler: Handler): Handler;

    handle (request: string): string;
}

export interface ISoundList
{
    [key: string]: Phaser.Sound.BaseSound;
}

export interface IStatus
{
    health: number,
    score: number,
    life: number,
    ammo: number,
    stage: number,
    canTakeStairs: boolean,
    position: TCoord,
}

export interface IPhysicsProperties
{
    gravity: number,
    speed: number,
    acceleration: number,
    dragCoeff: number,
    stairSpeed?: number,
    isHurt: boolean,
    isDead: boolean,
    isAttacking: boolean,
    isPaused: boolean,
    sinHeight?: number
}

export interface IAnimationList
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
    UP?: string | Phaser.Animations.Animation,
    DOWN?: string | Phaser.Animations.Animation,
    UPSTAIR_ATTACK?: string | Phaser.Animations.Animation,
    DOWNSTAIR_ATTACK?: string | Phaser.Animations.Animation,
    UPSTAIR_SECONDARY_ATTACK?: string | Phaser.Animations.Animation,
    DOWNSTAIR_SECONDARY_ATTACK?: string | Phaser.Animations.Animation,
    FLY?: string | Phaser.Animations.Animation
}

export interface IFrameList
{
    stairDown: string,
    stairUp: string,
    stairMiddle: string
}

export interface IEnemyIA
{
    parent: Enemy;
    scene: GameScene;
    decides: ()=> void
}
