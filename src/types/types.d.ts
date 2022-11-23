import { Entity } from "../entities/Entity";
import Boomerang from "../entities/weapons/Boomerang";
import { Key } from "../inputs/Key";
import GameScene from "../scenes/GameScene";

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


export type RangedWeapon = Boomerang | undefined;

export type BaseItemConfig = {
    scene: GameScene;
    x: number;
    y: number;
    texture: string | Phaser.Textures.Texture;
    frame: string | number;
    quantity: number;
    name?: string
}

export type TWeaponConfig = {
    scene: GameScene;
    parent: Entity,
    x: number;
    y: number;
    texture: string;
    frame: string;
    anims: string;
    sound: number;
}

export type TNfsPlayer = {
    play: (fileName: string, trackNo: number) => {},
    stop: () => {}
}