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
            // { key: 'atlas', frame: 'knight-hero-jump_0' },
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
            { key: 'atlas', frame: 'richter-attack_0', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-attack_1', duration: 16 * 2 },
            { key: 'atlas', frame: 'richter-attack_2', duration: 16 * 4 },
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
}