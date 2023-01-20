import { ATLAS_NAMES, PLAYER_A_NAME, WIDTH } from "../../constant/config";
import { DEPTH } from "../../constant/depth";
import GameScene from "../../scenes/GameScene";
import { ICustomEffect } from "../../types/types";

export class RainEffect implements ICustomEffect
{
    public scene: GameScene;
    public name: string = 'rainEffect';
    public isActive: boolean = false;
    private rainEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private deathZone: Phaser.GameObjects.Particles.Zones.DeathZone;
    private rainDropGroup: Phaser.GameObjects.Group;
    private thunder: Phaser.GameObjects.Image | null;
    constructor(scene: GameScene)
    {
        this.scene = scene;

        this.rainEmitter = this.scene.add.particles(0, 0, ATLAS_NAMES.ITEMS, {
            frame: 'rain',
            y: 0,
            x: { min: 0, max: WIDTH + 128 },
            alpha: { min: 0.4, max: 0.8 },
            lifespan: 600,
            speedX: -120,
            speedY: 300,
            quantity: 2,
            frequency: 4,
            active: false
        });

        this.rainDropGroup = this.scene.add.group({
            defaultKey: ATLAS_NAMES.ITEMS,
            defaultFrame: 'rain-ground_0',
            setOrigin: { x: 0.5, y: 1 },
            setDepth: { depth: DEPTH.FRONT_LAYER + 51 },
            setScrollFactor: { x: 0, y: 0 },
            maxSize: 30,
            visible: true,
        });

        this.thunder = this.scene.add.image(37 * 16, 60 * 16, 'thunder').setOrigin(0, 0).setVisible(false);

        this.rainEmitter.setDepth(DEPTH.FRONT_LAYER + 50);

        // add deathZone of stage 1.1
        this.deathZone = this.rainEmitter.addDeathZone({
            type: 'onEnter',
            source: new Phaser.Geom.Rectangle(0, 70 * 16, 48 * 16, 18)
        });

        this.rainEmitter.on(Phaser.GameObjects.Particles.Events.DEATH_ZONE, (
            emitter: Phaser.GameObjects.Particles.ParticleEmitter,
            particle: Phaser.GameObjects.Particles.Particle,
            deathzone: Phaser.GameObjects.Particles.Zones.DeathZone
        ) =>
        {
            // add raindrop on particle kill
            const drop = this.rainDropGroup.getFirstDead(true, particle.x, particle.bounds.bottom - 16, ATLAS_NAMES.ITEMS, 'rain-ground_0', true);

            drop?.setActive(true).setVisible(true).setDepth(DEPTH.FRONT_LAYER + 51).setScrollFactor(0, 1);
            drop?.anims.play('rain');

            this.scene.time.addEvent({
                delay: particle.lifeCurrent,
                callback: () =>
                {
                    drop?.setActive(false).setVisible(false);
                }
            })
        });
    }

    addDeathZone(source: Phaser.Geom.Rectangle)
    {
        this.rainEmitter.removeDeathZone(this.deathZone);

        this.deathZone = this.rainEmitter.addDeathZone({
            type: 'onEnter',
            source: source
        });
    }

    update()
    {
        const { worldView } = this.scene.cameras.main;

        this.rainEmitter.setPosition(worldView.left, worldView.top);

        const player = this.scene.getPlayerByName(PLAYER_A_NAME);

        if (player.body.center.x > 38 * 16)
        {
            this.showThunder();
        }
    }

    start()
    {
        this.rainEmitter.setActive(true).setVisible(true);

        this.isActive = true;
    }

    stop()
    {
        this.isActive = false;

        this.rainEmitter.forEachAlive(rain => rain.kill(), this);

        this.rainEmitter.setActive(false).setVisible(false);
    }

    destroy()
    {
        this.stop();

        this.scene.customGame.customEffects.delete(this.name);

        this.rainEmitter.destroy();

        this.rainDropGroup.clear(true, true).destroy(true, true);

        this.thunder?.destroy();
    }

    showThunder()
    {
        if (this.thunder === null || this.thunder.visible) return;

        this.thunder.setVisible(true);

        this.scene.playSound(34, 1);

        this.scene.cameras.main.flash(75);

        this.scene.tweens.add({
            targets: this.thunder,
            alpha: 0,
            yoyo: true,
            duration: 150
        });

        this.scene.time.addEvent({
            delay: 300,
            callback: () =>
            {
                this.thunder?.setVisible(false);

                this.thunder?.destroy();

                this.thunder = null;
            }
        });
    }
}
