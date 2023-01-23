import { ATLAS_NAMES } from "../constant/config";

export default function createAnims(scene: Phaser.Scene)
{
    scene.anims.create({
        key: 'richter-idle',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-walk_0' },
        ],
        frameRate: 3,
        repeat: -1,
    });

    scene.anims.create({
        key: 'richter-walk',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-walk_0' },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-walk_1' },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-walk_2' },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-walk_1' }
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'richter-jump',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-jump' },
        ],
        frameRate: 4,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-fall',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-jump' }
        ],
        frameRate: 4,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-back-flip',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-back-flip_0' },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-back-flip_1' },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-back-flip_2' },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-back-flip_3' },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-crouch' }
        ],
        frameRate: 6,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-crouch',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-crouch' }
        ],
        frameRate: 4,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-stair-down',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-down_0' },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-down_1' }
        ],
        frameRate: Infinity,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-stair-up',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-up_0' },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-up_1' }
        ],
        frameRate: Infinity,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-attack',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-attack_0', duration: 16 * 3 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-attack_1', duration: 16 * 3 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-attack_2', duration: 16 * 6 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-attack2',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-attack2_0', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-attack2_1', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-attack2_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-crouch-attack',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-crouch-attack_0', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-crouch-attack_1', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-crouch-attack_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-jump-attack',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-jump-attack_0', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-jump-attack_1', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-jump-attack_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-jump-secondary-attack',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-jump-attack2_0', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-jump-attack2_1', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-jump-attack2_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-stair-up-attack',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-up-attack_0', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-up-attack_1', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-up-attack_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-stair-down-attack',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-down-attack_0', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-down-attack_1', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-down-attack_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-stair-up-secondary-attack',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-up-attack2_0', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-up-attack2_1', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-up-attack2_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-stair-down-secondary-attack',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-down-attack2_0', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-down-attack2_1', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-stair-down-attack2_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });


    scene.anims.create({
        key: 'richter-hurt',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-hurt_0', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-hurt_1', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-hurt_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-dead',
        frames: [
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-hurt_0', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-hurt_1', duration: 16 * 2 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-hurt_2', duration: 16 * 4 },
            { key: ATLAS_NAMES.PLAYER, frame: 'richter-dead', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'cross',
        frames: [
            { key: ATLAS_NAMES.ITEMS, frame: 'weapon-cross_1' },
            { key: ATLAS_NAMES.ITEMS, frame: 'weapon-cross_2' },
            { key: ATLAS_NAMES.ITEMS, frame: 'weapon-cross_3' },
            { key: ATLAS_NAMES.ITEMS, frame: 'weapon-cross_4' },
        ],
        frameRate: 16,
        repeat: -1,
    });

    scene.anims.create({
        key: 'holy-water',
        frames: [
            { key: ATLAS_NAMES.ITEMS, frame: 'weapon-holywater_1' },
            { key: ATLAS_NAMES.ITEMS, frame: 'weapon-holywater_2' },
            { key: ATLAS_NAMES.ITEMS, frame: 'weapon-holywater_3' },
            { key: ATLAS_NAMES.ITEMS, frame: 'weapon-holywater_4' },
        ],
        frameRate: 16,
        repeat: 2,
    });

    scene.anims.create({
        key: 'axe',
        frames: [
            { key: ATLAS_NAMES.ITEMS, frame: 'weapon-axe_3' },
            { key: ATLAS_NAMES.ITEMS, frame: 'weapon-axe_0' },
            { key: ATLAS_NAMES.ITEMS, frame: 'weapon-axe_1' },
            { key: ATLAS_NAMES.ITEMS, frame: 'weapon-axe_2' },
        ],
        frameRate: 16,
        repeat: -1,
    });

    scene.anims.create({
        key: 'orb',
        frames: [
            { key: ATLAS_NAMES.ITEMS, frame: 'magic-crystal_0' },
            { key: ATLAS_NAMES.ITEMS, frame: 'magic-crystal_1' },
        ],
        frameRate: 9,
        repeat: -1,
    });

    scene.anims.create({
        key: 'rain',
        frames: [
            { key: ATLAS_NAMES.ITEMS, frame: 'rain-ground_0' },
            { key: ATLAS_NAMES.ITEMS, frame: 'rain-ground_1' },
        ],
        frameRate: 18,
        repeat: 0,
    });

    /**
     * Enemies anims
     */
    // PRELOAD ATLAS //




    // ANIMS ATLAS //

    scene.anims.create({
        key: 'enemy-death',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'enemy-death-1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'enemy-death-2' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'enemy-death-3' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'enemy-death-4' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'enemy-death-5' },
        ],
        frameRate: 8,
        repeat: 0,
    });

    scene.anims.create({
        key: 'boss-death',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'enemy-death-2' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'enemy-death-3' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'enemy-death-4' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'enemy-death-5' },
        ],
        frameRate: 12,
        repeat: 2,
    });

    scene.anims.create({
        key: 'zombie-dead',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'zombie-dead_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'zombie-dead_0' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'red-skeleton-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'red-skeleton-walk_1' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'red-skeleton-walk',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'red-skeleton-walk_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'red-skeleton-walk_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'red-skeleton-walk_2' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'red-skeleton-dead',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'red-skeleton-dead_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'red-skeleton-dead_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'red-skeleton-dead_2' },
        ],
        frameRate: 8,
        repeat: 0,
    });

    scene.anims.create({
        key: 'skeleton-dead',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'skeleton-dead_2' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'skeleton-dead_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'skeleton-dead_0' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'cat-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'cat-idle_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'bat-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'bat-idle_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'bat-fly',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'bat-fly_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'bat-fly_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'bat-fly_2' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'bat-blue-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'bat-blue-idle_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'bat-blue-fly',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'bat-blue-fly_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'bat-blue-fly_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'bat-blue-fly_2' },
        ],
        frameRate: 10,
        repeat: -1,
    });

    scene.anims.create({
        key: 'skeleton-bone',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'skeleton-bone_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'skeleton-bone_2' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'skeleton-bone_1' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'bone-dragon-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'bone-dragon_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'bone-dragon_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'bone-dragon_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'bone-dragon_1' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'bone-dragon-attack',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'bone-dragon_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'bone-dragon_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'bone-dragon_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'bone-dragon_0' },
        ],
        frameRate: 8,
        repeat: 0,
    });

    scene.anims.create({
        key: 'bone-dragon-body-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'bone-dragon-body' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'dragon-cannon',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'dragon-cannon_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dragon-cannon_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dragon-cannon_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dragon-cannon_1' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'dragon-cannon-attack',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'dragon-cannon_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dragon-cannon_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dragon-cannon_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dragon-cannon_0' },
        ],
        frameRate: 8,
        repeat: 0,
    });

    scene.anims.create({
        key: 'fleaman-fall',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'fleaman-fall' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fleaman-walk',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'fleaman-idle_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fleaman-attack',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'fleaman-idle_0' },
        ],
        frameRate: 6,
        repeat: 0,
    });

    scene.anims.create({
        key: 'cat-run',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'cat-run_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'cat-run_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'cat-run_2' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'cat-run_3' },
        ],
        frameRate: 8,
        repeat: -1,
    });

    scene.anims.create({
        key: 'cat-jump',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'cat-run_1' }
        ],
        frameRate: 8,
        repeat: -1,
    });

    scene.anims.create({
        key: 'crow-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'crow-idle_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'crow-fly',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'crow-fly_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'crow-fly_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'crow-fly_2' }
        ],
        frameRate: 10,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fleaman-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'fleaman-idle_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'fleaman-idle_1' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'giant-bat-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'giant-bat-idle_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'giant-bat-fly',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'giant-bat-fly_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'giant-bat-fly_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'giant-bat-fly_2' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'eagle-fly',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'eagle-fly_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'eagle-fly_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'eagle-fly_2' },
        ],
        yoyo: true,
        frameRate: 9,
        repeat: 1,
    });

    scene.anims.create({
        key: 'fleaman-jump',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'fleaman-jump-forward' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fleaman-jump-up',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'fleaman-jump-up' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'medusa-fly',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'medusa-head_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'medusa-head_1' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'skull',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'skull_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'skull_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'skull_3' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'skull_2' },
        ],
        frameRate: 8,
        repeat: -1,
    });

    scene.anims.create({
        key: 'spear-knight-walk',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'spear-knight-walk_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'spear-knight-walk_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'spear-knight-walk_2' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'spear-knight-walk_1' },
        ],
        frameRate: 5,
        repeat: -1,
    });

    scene.anims.create({
        key: 'spear-knight-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'spear-knight-walk_2' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fishman-attack',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'fishman-attack_0' },
        ],
        frameRate: 2,
        repeat: 0,
    });

    scene.anims.create({
        key: 'fishman-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'fishman-walk_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fishman-walk',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'fishman-walk_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'fishman-walk_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'fishman-walk_2' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'fishman-walk_1' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fishman-jump',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'fishman-walk_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'fishman-walk_2' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fireBall',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'fireBall_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'fireBall_1' },
        ],
        frameRate: 6,
        repeat: -1,
    });



    scene.anims.create({
        key: 'skeleton-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'skeleton-walk_1' },
        ],
        frameRate: 1,
        repeat: -1,
    });

    scene.anims.create({
        key: 'skeleton-walk',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'skeleton-walk_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'skeleton-walk_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'skeleton-walk_2' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'skeleton-attack',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'skeleton-walk_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'skeleton-walk_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'skeleton-walk_1' },
        ],
        frameRate: 6,
        repeat: 0,
    });

    scene.anims.create({
        key: 'skeleton-jump',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'skeleton-walk_2' },
        ],
        frameRate: 1,
        repeat: -1,
    });

    scene.anims.create({
        key: 'zombie-attack',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'zombie-attack_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'zombie-attack_3' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'zombie-attack_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'zombie-attack_2' },
        ],
        frameRate: 8,
        repeat: -1,
    });

    scene.anims.create({
        key: 'zombie-walk',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'zombie-walk_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'zombie-walk_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'zombie-attack_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'zombie-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'zombie-walk_0' }
        ],
        frameRate: 8,
        repeat: -1,
    });

    scene.anims.create({
        key: 'axe-armor-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'axe-armor_0' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'axe-armor-walk',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'axe-armor_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'axe-armor_1' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'axe-armor-attack',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'axe-armor_0' },
        ],
        frameRate: 4,
        repeat: 0,
    });

    scene.anims.create({
        key: 'mummy-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'mummy-walk_2' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'mummy-walk',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'mummy-walk_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'mummy-walk_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'mummy-walk_2' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'mummy-walk_1' },
        ],
        frameRate: 5,
        repeat: -1,
    });

    scene.anims.create({
        key: 'bandage',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'bandage_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'bandage_2' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'bandage_4' },
        ],
        frameRate: 9,
        repeat: -1,
    });

    scene.anims.create({
        key: 'dracula2-jump',
        frames: [
            //{ key: ATLAS_NAMES.ENEMIES, frame: 'dracula2-jump_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula2-jump_1' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'dracula2-attack',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula2-idle' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula2-attack_0', duration: 100 },
        ],
        frameRate: 2,
        repeat: 0,
    });

    scene.anims.create({
        key: 'dracula2-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula2-idle' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'dracula2-fly',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula2-fly_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula2-fly_2' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula2-fly_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula2-fly_3' },
        ],
        frameRate: 8,
        yoyo: true,
        repeat: -1,
    });

    scene.anims.create({
        key: 'dracula-appears',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-appears_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-appears_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-appears_2' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-appears_3' },
        ],
        frameRate: 12,
        repeat: 0,
    });

    scene.anims.create({
        key: 'dracula-first-appears',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-first-appears_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-first-appears_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-first-appears_2' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-first-appears_3' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-attack_0', duration: 1000 },
        ],
        frameRate: 8,
        repeat: 0,
    });

    scene.anims.create({
        key: 'dracula-attack',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-attack_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-attack_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-attack_2', duration: 500 },
        ],
        frameRate: 8,
        repeat: 0,
    });

    scene.anims.create({
        key: 'dracula-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-attack_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-attack_1' }
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'dracula-death',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-death_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-death_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'dracula-death_2' }
        ],
        frameRate: 8,
        repeat: 0,
    });

    scene.anims.create({
        key: 'spike-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'spikes' },
        ],
        frameRate: 1,
        repeat: -1,
    });

    scene.anims.create({
        key: 'medusa-boss-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'medusa_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'medusa_1' },
        ],
        frameRate: 3,
        repeat: -1,
    });

    scene.anims.create({
        key: 'medusa-boss-fly',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'medusa_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'medusa_1' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'snake-walk',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'snake_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'snake_1' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'frank-walk',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'frank_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'frank_1' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'frank-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'frank_1' },
        ],
        frameRate: 1,
        repeat: -1,
    });

    scene.anims.create({
        key: 'death-idle',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'death_0' },
        ],
        frameRate: 1,
        repeat: -1,
    });

    scene.anims.create({
        key: 'death-fly',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'death_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'death_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'death_2' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'death_1' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'scythe',
        frames: [
            { key: ATLAS_NAMES.ENEMIES, frame: 'scythe_0' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'scythe_1' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'scythe_2' },
            { key: ATLAS_NAMES.ENEMIES, frame: 'scythe_3' },
        ],
        frameRate: 8,
        repeat: -1,
    });

    scene.anims.create({
        key: 'smoke',
        frames: [
            { key: ATLAS_NAMES.ITEMS, frame: 'smoke_1' },
            { key: ATLAS_NAMES.ITEMS, frame: 'smoke_2' },
            { key: ATLAS_NAMES.ITEMS, frame: 'smoke_3' },
            { key: ATLAS_NAMES.ITEMS, frame: 'smoke_4' },
            { key: ATLAS_NAMES.ITEMS, frame: 'smoke_5' },
        ],
        frameRate: 22,
        repeat: 0,
    });

    scene.anims.create({
        key: 'puff',
        frames: [
            { key: ATLAS_NAMES.ITEMS, frame: 'puff_1' },
            { key: ATLAS_NAMES.ITEMS, frame: 'puff_2' },
            { key: ATLAS_NAMES.ITEMS, frame: 'puff_3' },
            { key: ATLAS_NAMES.ITEMS, frame: 'puff_4' },
            { key: ATLAS_NAMES.ITEMS, frame: 'puff_5' },
            { key: ATLAS_NAMES.ITEMS, frame: 'puff_6' },
            { key: ATLAS_NAMES.ITEMS, frame: 'puff_7' },
            { key: ATLAS_NAMES.ITEMS, frame: 'puff_8' },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'impact',
        frames: [
            { key: ATLAS_NAMES.ITEMS, frame: 'impact_1' },
            { key: ATLAS_NAMES.ITEMS, frame: 'impact_2' },
            { key: ATLAS_NAMES.ITEMS, frame: 'impact_3' }
        ],
        frameRate: 22,
        repeat: 0,
    });

}