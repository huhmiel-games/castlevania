import { PALETTE_DB32 } from '../constant/colors';
import { WIDTH, HEIGHT, FONTS, SCENES_NAMES, MOBILE_OS } from '../constant/config';
import { InputController } from '../inputs/InputController';

/**
 * @author © Philippe Pereira 2022
 * @export
 * @class GameOverScene
 * @extends {Scene}
 */
export default class GameOverScene extends Phaser.Scene
{
    private inputController: InputController;
    private canContinue: boolean = false;
    constructor(retry: boolean)
    {
        super(SCENES_NAMES.GAMEOVER);
    }

    public create(data)
    {
        this.inputController = InputController.getInstance();
        this.inputController.isActive = false;
        this.input.enabled = false;

        this.canContinue = data.retry;

        const gameOverText: Phaser.GameObjects.BitmapText = this.add.bitmapText(WIDTH / 2, HEIGHT / 2, FONTS.GALAXY, 'game over', 16, 1)
            .setOrigin(0.5, 0.5)
            .setName('gameOverText')
            .setLetterSpacing(2)
            .setAlpha(0)
            .setTintFill(PALETTE_DB32.WELL_READ);

        const song = this.sound.add('14');
        song.once(Phaser.Sound.Events.COMPLETE, () =>
        {
            this.inputController.isActive = true;
        });

        song.play();

        this.startGameOverTextTween(gameOverText);
    }

    public update(time: number, delta: number): void
    {
        const { a, b, x, y,  start, select } = this.inputController.playerAButtons;

        if (a.isDown || b.isDown || a.isDown || y.isDown || start.isDown || select.isDown)
        {
            this.retry();
        }
    }

    private startGameOverTextTween(gameOverText: Phaser.GameObjects.BitmapText)
    {
        this.tweens.add({
            targets: gameOverText,
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 0,
            repeat: 0,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1,
            }
        });
    }

    private retry()
    {
        // this.scene.start(SCENES_NAMES.GAME, { retry: true})
        this.scene.start(SCENES_NAMES.MENU);
        this.scene.stop(SCENES_NAMES.HUD);
    }
}