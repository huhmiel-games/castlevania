import { HEIGHT, HUD_EVENTS_NAMES, PLAYER_A_NAME, WIDTH } from "../../constant/config";
import { Boss } from "../../entities/enemies/Boss";
import GameScene from "../../scenes/GameScene";
import { IEnemyAI, RangedWeapon } from "../../types/types";
import { EPossibleState } from "../../constant/character";
import { DEPTH } from "../../constant/depth";
import Weapon from "../../entities/weapons/Weapon";
import FireBall from "../../entities/weapons/FireBall";

/**
 * littles jumps or fire attack
 * if player in corner high jump
 */
export class Dracula2IA implements IEnemyAI
{
    parent: Boss;
    scene: GameScene;
    private isAttacking: boolean = false;
    private isJumping: boolean = false;
    private moveTime: number = 0;
    constructor(parent: Boss)
    {
        this.parent = parent;
        this.scene = parent.scene;

        this.parent.setVisible(true);

        this.parent.body.setAllowGravity(true).setEnable(true);

        this.parent.anims.play(this.parent.animList.IDLE!);

        this.parent.startBattle();

        this.scene.playSong(9, true);

        this.moveTime = this.scene.time.now + 3000;

        this.scene.events.emit(HUD_EVENTS_NAMES.BOSS_HEALTH, Math.ceil(this.parent.status.health / 2));
    }

    execute()
    {
        const { body, buttons, stateMachine } = this.parent;

        const { left, right, b } = buttons;

        const { blocked, center } = body;

        const cam = this.scene.cameras.main;

        const { now } = this.scene.time;

        if (!cam.worldView.contains(center.x, center.y))
        {
            return;
        }

        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

        // handle flipX
        if (blocked.down && this.parent.damageBody.body.right < player.body.left)
        {
            this.parent.setFlipX(false);

            left.setUp(now);
            right.setDown(now);
        }
        else if (blocked.down && this.parent.damageBody.body.left > player.body.right)
        {
            this.parent.setFlipX(true);

            right.setUp(now);
            left.setDown(now);
        }

        // attack or little jump
        if (blocked.down && !this.isJumping && this.moveTime < now)
        {
            const rnd = Phaser.Math.RND.between(0, 100);

            const positionX = this.parent.damageBody.body.center.x;

            const { x: playerX } = player.body.center;

            const centerZone = [291 * 16, 300 * 16];
            const cornerZone = [292 * 16, 299 * 16];

            // fire attack if in center screen
            if (rnd < 40 && positionX > centerZone[0] && positionX < centerZone[1] && !this.isAttacking)
            {
                this.isAttacking = true;

                this.attacks();

                this.moveTime = now + 1500;

                return;
            }

            // little jump if center screen
            if (rnd >= 60 && positionX > centerZone[0] && positionX < centerZone[1])
            {
                this.parent.config.physicsProperties.jumpHeight = 3;

                this.isJumping = true;

                b.setDown(now);

                this.scene.time.addEvent({
                    delay: 500,
                    callback: () =>
                    {
                        b.setUp(this.scene.time.now);

                        this.moveTime = now + 1500;
                    }
                });

                return;
            }

            if ((positionX < cornerZone[0] && playerX < cornerZone[0] && playerX < positionX)
                || (positionX > cornerZone[1] && playerX > cornerZone[1] && playerX > positionX)
            )
            {
                this.parent.config.physicsProperties.jumpHeight = 6;

                b.setDown(now);

                this.scene.time.addEvent({
                    delay: 500,
                    callback: () =>
                    {
                        b.setUp(this.scene.time.now);

                        this.moveTime = now + 1500;
                    }
                });

                return;
            }
            else
            {
                this.parent.config.physicsProperties.jumpHeight = 3;

                this.isJumping = true;

                b.setDown(now);

                this.scene.time.addEvent({
                    delay: 500,
                    callback: () =>
                    {
                        b.setUp(this.scene.time.now);

                        this.moveTime = now + 1500;
                    }
                });

                return;
            }
        }

        if (blocked.down && this.isJumping && stateMachine.state === EPossibleState.IDLE && stateMachine.prevState === EPossibleState.FALL)
        {
            this.isJumping = false;

            this.isAttacking = false;
        }
    }

    private attacks()
    {
        this.parent.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        {
            this.fireAttack();

            this.parent.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
            {
                this.isAttacking = false;

                this.parent.anims.play(this.parent.animList.IDLE!, true);
            });

            this.parent.anims.playReverse(this.parent.animList.SECONDARY_ATTACK!, true);
        });

        this.parent.anims.play(this.parent.animList.SECONDARY_ATTACK!, true);
    }

    private fireAttack()
    {
        const { center } = this.parent.damageBody.body;
        const { x, y } = center;

        const { flipX } = this.parent;

        const targetX = flipX ? x - WIDTH : x + WIDTH;

        const offsetX = flipX ? -8 : 8;

        const targetY = [8 * 16, 10 * 16, 12 * 16];

        for (let i = 0; i < 3; i += 1)
        {
            const fireBall = this.scene.enemyWeaponGroup.getFirstDead(false, x, y, undefined, undefined, true) as RangedWeapon;

            if (!fireBall) return;

            fireBall.body.reset(x + offsetX, y - 12);

            fireBall.setFlipX(this.parent.flipX);

            fireBall.setActive(true).setVisible(true).setAlpha(1);

            this.parent.secondaryWeaponGroup.add(fireBall);

            this.scene.physics.world.enable(fireBall);

            fireBall.body.setEnable(true);

            this.scene.physics.accelerateTo(fireBall, targetX, targetY[i], 600, 150, 150);
        }
    }

    reset()
    {

    }
}
