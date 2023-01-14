import { HEIGHT, PLAYER_A_NAME, WIDTH } from "../../constant/config";
import { Boss } from "../entities/Boss";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI } from "../../types/types";
import { EPossibleState } from "../../constant/character";
import { DEPTH } from "../../constant/depth";
import Weapon from "../../entities/weapons/Weapon";
import FireBall from "../../entities/weapons/FireBall";


export class DraculaIA implements IEnemyAI
{
    parent: Boss;
    scene: GameScene;
    private phase: 0 | 1 | 2 | 3 = 0; // 0 before battle 1 appear 2 attack 3 disappears
    private isAttacking: boolean = false;
    private isAppearing: boolean = false;
    private isDisappears: boolean = false;
    private appearSprite: Phaser.GameObjects.Sprite;
    private attackTime: number = 0;
    constructor(parent: Boss)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.parent.damageBody.setActive(false)
        this.parent.setVisible(false).setFlipX(true);

        this.parent.body.setAllowGravity(false).setEnable(false);

        this.parent.damageBody.body.setEnable(false);

        this.parent.anims.play(this.parent.animList.IDLE!);

        this.appearSprite = this.scene.add.sprite(0, 0, 'enemies', 'dracula-appears_0')
            .setActive(true)
            .setVisible(false)
            .setOrigin(0.5, 1)
            .setDisplaySize(48, HEIGHT - 32)
            .setDepth(DEPTH.FRONT_LAYER);

    }

    execute()
    {
        const { body, physicsProperties } = this.parent;

        const { center } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (!cam.worldView.contains(center.x, center.y) || physicsProperties.isDead)
        {
            return;
        }

        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

        // starts the battle
        if (player.body.center.x < 295 * 16 && !this.scene.isBossBattle)
        {
            this.parent.startBattle();

            this.scene.time.addEvent({
                delay: 1000,
                callback: () =>
                {
                    this.parent.damageBody.setActive(true);
                    this.parent.setActive(true).setVisible(true);
                    this.parent.body.setEnable(true);

                    this.parent.setAlpha(1);

                    this.parent.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
                    {
                        this.parent.anims.play(this.parent.animList.IDLE!);

                        this.phase = 1;
                    });

                    this.parent.anims.play(this.parent.animList.DOWN!);
                }
            });
        }

        // handle flipX
        if (this.parent.body.center.x < player.body.center.x)
        {
            this.parent.setFlipX(false);
        }
        else
        {
            this.parent.setFlipX(true);
        }

        // handle attack
        if (this.phase === 1 && this.attackTime < now)
        {
            if (this.isAppearing) return;

            this.isAppearing = true;

            const randomPositionX = Phaser.Math.RND.integerInRange(288, 303) * 16;

            this.appears(randomPositionX);

            this.attackTime = now + 5000;
        }

        if (this.phase === 2)
        {
            if (this.isAttacking) return;

            this.isAttacking = true;

            this.attacks();
        }

        if (this.phase === 3)
        {
            if (this.isDisappears) return;

            this.isDisappears = true;

            this.disappears();
        }
    }

    // phase 1
    private appears(randomPositionX: number)
    {
        this.appearSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        {
            this.parent.body.reset(randomPositionX, this.parent.body.y - 24)

            this.parent.setVisible(true);

            this.appearSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
            {
                this.parent.damageBody.body.setEnable(true);

                this.phase = 2;

                this.isAppearing = false;

                this.appearSprite.setVisible(false);
            });

            this.appearSprite.anims.playReverse(this.parent.animList.UP!)
        });


        this.appearSprite.setPosition(randomPositionX, this.parent.getBottomCenter().y)
            .setVisible(true);

        this.appearSprite.anims.play(this.parent.animList.UP!)
    }

    // phase 3
    private disappears()
    {
        this.appearSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        {
            this.parent.setVisible(false).damageBody.body?.setEnable(false);

            this.appearSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
            {
                this.phase = 1;

                this.isDisappears = false;

                this.appearSprite.setVisible(false);
            });

            this.appearSprite.anims.playReverse(this.parent.animList.UP!)
        });

        this.appearSprite.setVisible(true);
        this.appearSprite.anims.play(this.parent.animList.UP!)
    }

    // phase 2
    private attacks()
    {
        this.parent.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        {
            if (this.isDead()) return;

            this.fireAttack();

            this.parent.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
            {
                if (this.isDead()) return;

                this.phase = 3;

                this.isAttacking = false;

                this.parent.anims.play(this.parent.animList.IDLE!, true);
            });

            this.parent.anims.playReverse(this.parent.animList.SECONDARY_ATTACK!, true);
        });

        this.parent.anims.play(this.parent.animList.SECONDARY_ATTACK!, true);
    }

    private fireAttack()
    {
        const { bottom, top, center } = this.parent.damageBody.body;
        const { x, y } = center;

        const targetX = this.parent.flipX ? x - WIDTH * 2 : x + WIDTH * 2;

        const targetY = [10 * 16, 11 * 16, 12 * 16];

        for (let i = 0; i < 3; i += 1)
        {
            const fireBall = this.scene.enemyWeaponGroup.getFirstDead(true, x, y) as FireBall;

            fireBall.body.reset(x, y + 4);

            fireBall.setFlipX(this.parent.flipX);

            fireBall.setActive(true).setVisible(true);

            this.scene.physics.world.enable(fireBall);

            fireBall.body.setEnable(true);

            this.scene.physics.accelerateTo(fireBall, targetX, targetY[i], 600, 150, 150);
        }
    }

    private isDead()
    {
        return this.parent.physicsProperties.isDead;
    }

    reset()
    {

    }
}
