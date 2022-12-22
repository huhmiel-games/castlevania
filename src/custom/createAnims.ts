export default function createAnims(scene: Phaser.Scene)
{
    scene.anims.create({
        key: 'richter-idle',
        frames: [
            { key: 'atlas', frame: 'richter-walk_0' },
        ],
        frameRate: 3,
        repeat: -1,
    });

    scene.anims.create({
        key: 'richter-walk',
        frames: [
            { key: 'atlas', frame: 'richter-walk_0' },
            { key: 'atlas', frame: 'richter-walk_1' },
            { key: 'atlas', frame: 'richter-walk_2' },
            { key: 'atlas', frame: 'richter-walk_1' }
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'richter-jump',
        frames: [
            { key: 'atlas', frame: 'richter-jump' },
        ],
        frameRate: 4,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-fall',
        frames: [
            { key: 'atlas', frame: 'richter-jump' }
        ],
        frameRate: 4,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-back-flip',
        frames: [
            { key: 'atlas', frame: 'richter-back-flip_0' },
            { key: 'atlas', frame: 'richter-back-flip_1' },
            { key: 'atlas', frame: 'richter-back-flip_2' },
            { key: 'atlas', frame: 'richter-back-flip_3' },
            { key: 'atlas', frame: 'richter-crouch' }
        ],
        frameRate: 6,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-crouch',
        frames: [
            { key: 'atlas', frame: 'richter-crouch' }
        ],
        frameRate: 4,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-stair-down',
        frames: [
            { key: 'atlas', frame: 'richter-stair-down_0' },
            { key: 'atlas', frame: 'richter-stair-down_1' }
        ],
        frameRate: Infinity,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-stair-up',
        frames: [
            { key: 'atlas', frame: 'richter-stair-up_0' },
            { key: 'atlas', frame: 'richter-stair-up_1' }
        ],
        frameRate: Infinity,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-attack',
        frames: [
            { key: 'atlas', frame: 'richter-attack_0', duration: 16 * 3 },
            { key: 'atlas', frame: 'richter-attack_1', duration: 16 * 3 },
            { key: 'atlas', frame: 'richter-attack_2', duration: 16 * 6 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-attack2',
        frames: [
            { key: 'atlas', frame: 'richter-attack2_0', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-attack2_1', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-attack2_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-crouch-attack',
        frames: [
            { key: 'atlas', frame: 'richter-crouch-attack_0', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-crouch-attack_1', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-crouch-attack_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-jump-attack',
        frames: [
            { key: 'atlas', frame: 'richter-jump-attack_0', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-jump-attack_1', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-jump-attack_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-stair-up-attack',
        frames: [
            { key: 'atlas', frame: 'richter-stair-up-attack_0', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-stair-up-attack_1', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-stair-up-attack_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-stair-down-attack',
        frames: [
            { key: 'atlas', frame: 'richter-stair-down-attack_0', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-stair-down-attack_1', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-stair-down-attack_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-stair-up-secondary-attack',
        frames: [
            { key: 'atlas', frame: 'richter-stair-up-attack2_0', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-stair-up-attack2_1', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-stair-up-attack2_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-stair-down-secondary-attack',
        frames: [
            { key: 'atlas', frame: 'richter-stair-down-attack2_0', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-stair-down-attack2_1', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-stair-down-attack2_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });


    scene.anims.create({
        key: 'richter-hurt',
        frames: [
            { key: 'atlas', frame: 'richter-hurt_0', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-hurt_1', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-hurt_2', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'richter-dead',
        frames: [
            { key: 'atlas', frame: 'richter-hurt_0', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-hurt_1', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-hurt_2', duration: 16 * 4 },
            { key: 'atlas', frame: 'richter-dead', duration: 16 * 4 },
        ],
        frameRate: 16,
        repeat: 0,
    });

    scene.anims.create({
        key: 'cross',
        frames: [
            { key: 'items', frame: 'weapon-cross_1' },
            { key: 'items', frame: 'weapon-cross_2' },
            { key: 'items', frame: 'weapon-cross_3' },
            { key: 'items', frame: 'weapon-cross_4' },
        ],
        frameRate: 16,
        repeat: -1,
    });

    scene.anims.create({
        key: 'holy-water',
        frames: [
            { key: 'items', frame: 'weapon-holywater_1' },
            { key: 'items', frame: 'weapon-holywater_2' },
            { key: 'items', frame: 'weapon-holywater_3' },
            { key: 'items', frame: 'weapon-holywater_4' },
        ],
        frameRate: 16,
        repeat: 2,
    });

    scene.anims.create({
        key: 'axe',
        frames: [
            { key: 'items', frame: 'weapon-axe_3' },
            { key: 'items', frame: 'weapon-axe_0' },
            { key: 'items', frame: 'weapon-axe_1' },
            { key: 'items', frame: 'weapon-axe_2' },
        ],
        frameRate: 16,
        repeat: -1,
    });

    /**
     * Enemies anims
     */
    // PRELOAD ATLAS //




    // ANIMS ATLAS //

    scene.anims.create({
        key: 'enemy-death',
        frames: [
            { key: 'enemies', frame: 'enemy-death-1' },
            { key: 'enemies', frame: 'enemy-death-2' },
            { key: 'enemies', frame: 'enemy-death-3' },
            { key: 'enemies', frame: 'enemy-death-4' },
            { key: 'enemies', frame: 'enemy-death-5' },
        ],
        frameRate: 8,
        repeat: 0,
    });

    scene.anims.create({
        key: 'zombie-dead',
        frames: [
            { key: 'enemies', frame: 'zombie-dead_1' },
            { key: 'enemies', frame: 'zombie-dead_0' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'red-skeleton-idle',
        frames: [
            { key: 'enemies', frame: 'red-skeleton-walk_1' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'red-skeleton-walk',
        frames: [
            { key: 'enemies', frame: 'red-skeleton-walk_0' },
            { key: 'enemies', frame: 'red-skeleton-walk_1' },
            { key: 'enemies', frame: 'red-skeleton-walk_2' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'red-skeleton-dead',
        frames: [
            { key: 'enemies', frame: 'red-skeleton-dead_0' },
            { key: 'enemies', frame: 'red-skeleton-dead_1' },
            { key: 'enemies', frame: 'red-skeleton-dead_2' },
        ],
        frameRate: 8,
        repeat: 0,
    });

    scene.anims.create({
        key: 'skeleton-dead',
        frames: [
            { key: 'enemies', frame: 'skeleton-dead_2' },
            { key: 'enemies', frame: 'skeleton-dead_1' },
            { key: 'enemies', frame: 'skeleton-dead_0' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'cat-idle',
        frames: [
            { key: 'enemies', frame: 'cat-idle_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'bat-idle',
        frames: [
            { key: 'enemies', frame: 'bat-idle_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'bat-fly',
        frames: [
            { key: 'enemies', frame: 'bat-fly_0' },
            { key: 'enemies', frame: 'bat-fly_1' },
            { key: 'enemies', frame: 'bat-fly_2' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'bat-blue-idle',
        frames: [
            { key: 'enemies', frame: 'bat-blue-idle_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'bat-blue-fly',
        frames: [
            { key: 'enemies', frame: 'bat-blue-fly_0' },
            { key: 'enemies', frame: 'bat-blue-fly_1' },
            { key: 'enemies', frame: 'bat-blue-fly_2' },
        ],
        frameRate: 10,
        repeat: -1,
    });

    scene.anims.create({
        key: 'skeleton-bone',
        frames: [
            { key: 'enemies', frame: 'skeleton-bone_0' },
            { key: 'enemies', frame: 'skeleton-bone_2' },
            { key: 'enemies', frame: 'skeleton-bone_1' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'dragon-cannon',
        frames: [
            { key: 'enemies', frame: 'dragon-cannon_1' },
            { key: 'enemies', frame: 'dragon-cannon_1' },
            { key: 'enemies', frame: 'dragon-cannon_1' },
            { key: 'enemies', frame: 'dragon-cannon_1' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'dragon-cannon-attack',
        frames: [
            { key: 'enemies', frame: 'dragon-cannon_0' },
            { key: 'enemies', frame: 'dragon-cannon_0' },
            { key: 'enemies', frame: 'dragon-cannon_0' },
            { key: 'enemies', frame: 'dragon-cannon_0' },
        ],
        frameRate: 8,
        repeat: 0,
    });

    scene.anims.create({
        key: 'fleaman-fall',
        frames: [
            { key: 'enemies', frame: 'fleaman-fall' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fleaman-walk',
        frames: [
            { key: 'enemies', frame: 'fleaman-idle_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'axe',
        frames: [
            { key: 'enemies', frame: 'axe' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'cat-run',
        frames: [
            { key: 'enemies', frame: 'cat-run_0' },
            { key: 'enemies', frame: 'cat-run_1' },
            { key: 'enemies', frame: 'cat-run_2' },
            { key: 'enemies', frame: 'cat-run_3' },
        ],
        frameRate: 8,
        repeat: -1,
    });

    scene.anims.create({
        key: 'cat-jump',
        frames: [
            { key: 'enemies', frame: 'cat-run_1' }
        ],
        frameRate: 8,
        repeat: -1,
    });

    scene.anims.create({
        key: 'crow-idle',
        frames: [
            { key: 'enemies', frame: 'crow-idle_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fleaman-idle',
        frames: [
            { key: 'enemies', frame: 'fleaman-idle_0' },
            { key: 'enemies', frame: 'fleaman-idle_1' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'giant-bat-fly',
        frames: [
            { key: 'enemies', frame: 'giant-bat-fly_1' },
            { key: 'enemies', frame: 'giant-bat-fly_0' },
            { key: 'enemies', frame: 'giant-bat-fly_2' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'eagle-fly',
        frames: [
            { key: 'enemies', frame: 'eagle-fly_2' },
            { key: 'enemies', frame: 'eagle-fly_1' },
            { key: 'enemies', frame: 'eagle-fly_0' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fleaman-jump',
        frames: [
            { key: 'enemies', frame: 'fleaman-jump-forward' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'giant-bat-idle',
        frames: [
            { key: 'enemies', frame: 'giant-bat-idle_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fleaman-jump-up',
        frames: [
            { key: 'enemies', frame: 'fleaman-jump-up' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'crow-fly',
        frames: [
            { key: 'enemies', frame: 'crow-fly_1' },
            { key: 'enemies', frame: 'crow-fly_2' },
            { key: 'enemies', frame: 'crow-fly_0' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'medusa-fly',
        frames: [
            { key: 'enemies', frame: 'medusa-head_0' },
            { key: 'enemies', frame: 'medusa-head_1' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'skull',
        frames: [
            { key: 'enemies', frame: 'skull_1' },
            { key: 'enemies', frame: 'skull_0' },
            { key: 'enemies', frame: 'skull_3' },
            { key: 'enemies', frame: 'skull_2' },
        ],
        frameRate: 8,
        repeat: -1,
    });

    scene.anims.create({
        key: 'spear-knight-walk',
        frames: [
            { key: 'enemies', frame: 'spear-knight-walk_0' },
            { key: 'enemies', frame: 'spear-knight-walk_1' },
            { key: 'enemies', frame: 'spear-knight-walk_2' },
            { key: 'enemies', frame: 'spear-knight-walk_1' },
        ],
        frameRate: 5,
        repeat: -1,
    });

    scene.anims.create({
        key: 'spear-knight-idle',
        frames: [
            { key: 'enemies', frame: 'spear-knight-walk_2' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fishman-attack',
        frames: [
            { key: 'enemies', frame: 'fishman-attack_0' },
        ],
        frameRate: 2,
        repeat: 0,
    });

    scene.anims.create({
        key: 'fishman-idle',
        frames: [
            { key: 'enemies', frame: 'fishman-walk_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fishman-walk',
        frames: [
            { key: 'enemies', frame: 'fishman-walk_0' },
            { key: 'enemies', frame: 'fishman-walk_1' },
            { key: 'enemies', frame: 'fishman-walk_2' },
            { key: 'enemies', frame: 'fishman-walk_1' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fishman-jump',
        frames: [
            { key: 'enemies', frame: 'fishman-walk_0' },
            { key: 'enemies', frame: 'fishman-walk_2' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fireBall',
        frames: [
            { key: 'enemies', frame: 'fireBall_0' },
            { key: 'enemies', frame: 'fireBall_1' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    

    scene.anims.create({
        key: 'skeleton-idle',
        frames: [
            { key: 'enemies', frame: 'skeleton-walk_1' },
        ],
        frameRate: 1,
        repeat: -1,
    });

    scene.anims.create({
        key: 'skeleton-walk',
        frames: [
            { key: 'enemies', frame: 'skeleton-walk_0' },
            { key: 'enemies', frame: 'skeleton-walk_1' },
            { key: 'enemies', frame: 'skeleton-walk_2' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'skeleton-attack',
        frames: [
            { key: 'enemies', frame: 'skeleton-walk_1' },
            { key: 'enemies', frame: 'skeleton-walk_1' },
            { key: 'enemies', frame: 'skeleton-walk_1' },
        ],
        frameRate: 6,
        repeat: 0,
    });

    scene.anims.create({
        key: 'skeleton-jump',
        frames: [
            { key: 'enemies', frame: 'skeleton-walk_2' },
        ],
        frameRate: 1,
        repeat: -1,
    });

    scene.anims.create({
        key: 'zombie-attack',
        frames: [
            { key: 'enemies', frame: 'zombie-attack_1' },
            { key: 'enemies', frame: 'zombie-attack_3' },
            { key: 'enemies', frame: 'zombie-attack_0' },
            { key: 'enemies', frame: 'zombie-attack_2' },
        ],
        frameRate: 8,
        repeat: -1,
    });

    scene.anims.create({
        key: 'zombie-walk',
        frames: [
            { key: 'enemies', frame: 'zombie-walk_0' },
            { key: 'enemies', frame: 'zombie-walk_1' },
            { key: 'enemies', frame: 'zombie-attack_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'zombie-idle',
        frames: [
            { key: 'enemies', frame: 'zombie-walk_0' }
        ],
        frameRate: 8,
        repeat: -1,
    });

    scene.anims.create({
        key: 'axe-armor-idle',
        frames: [
            { key: 'enemies', frame: 'axe-armor_0' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'axe-armor-walk',
        frames: [
            { key: 'enemies', frame: 'axe-armor_0' },
            { key: 'enemies', frame: 'axe-armor_1' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'axe-armor-attack',
        frames: [
            { key: 'enemies', frame: 'axe-armor_0' },
        ],
        frameRate: 4,
        repeat: 0,
    });

    scene.anims.create({
        key: 'mummy-walk',
        frames: [
            { key: 'enemies', frame: 'mummy-walk_2' },
            { key: 'enemies', frame: 'mummy-walk_1' },
            { key: 'enemies', frame: 'mummy-walk_0' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'jump',
        frames: [
            { key: 'enemies', frame: 'jump_0' },
            { key: 'enemies', frame: 'jump_1' },
        ],
        frameRate: 4,
        repeat: -1,
    });

    scene.anims.create({
        key: 'attack',
        frames: [
            { key: 'enemies', frame: 'attack_0' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'dracula-appears',
        frames: [
            { key: 'enemies', frame: 'dracula-appears_0' },
            { key: 'enemies', frame: 'dracula-appears_1' },
            { key: 'enemies', frame: 'dracula-appears_2' },
            { key: 'enemies', frame: 'dracula-appears_3' },
        ],
        frameRate: 8,
        repeat: -1,
    });

    scene.anims.create({
        key: 'idle',
        frames: [
            { key: 'enemies', frame: 'idle' },
        ],
        frameRate: 2,
        repeat: -1,
    });

    scene.anims.create({
        key: 'dracula-attack',
        frames: [
            { key: 'enemies', frame: 'dracula-attack_3' },
            { key: 'enemies', frame: 'dracula-attack_1' },
            { key: 'enemies', frame: 'dracula-attack_2' },
            { key: 'enemies', frame: 'dracula-attack_4' },
            { key: 'enemies', frame: 'dracula-attack_5' },
            { key: 'enemies', frame: 'dracula-attack_6' },
            { key: 'enemies', frame: 'dracula-attack_0' },
        ],
        frameRate: 14,
        repeat: -1,
    });

    scene.anims.create({
        key: 'dracula-sleeping',
        frames: [
            { key: 'enemies', frame: 'dracula-sleeping_0' },
            { key: 'enemies', frame: 'dracula-sleeping_1' },
            { key: 'enemies', frame: 'dracula-sleeping_3' },
        ],
        frameRate: 6,
        repeat: -1,
    });

    scene.anims.create({
        key: 'fly',
        frames: [
            { key: 'enemies', frame: 'fly_1' },
            { key: 'enemies', frame: 'fly_2' },
            { key: 'enemies', frame: 'fly_0' },
            { key: 'enemies', frame: 'fly_3' },
        ],
        frameRate: 8,
        repeat: -1,
    });

}