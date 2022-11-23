import { FONTS, FONTS_SIZES, HEIGHT, SCENES_NAMES, WIDTH } from "../constant/config";
import createAnims from "../custom/createAnims";
import preloadAssets from "../custom/preloadAssets";

/**
 * @author © Philippe Pereira 2021
 * @export
 * @class LoadScene
 * @extends {Scene}
 */
export default class LoadScene extends Phaser.Scene
{
    constructor()
    {
        super({
            key: SCENES_NAMES.LOAD,
            active: false,
            visible: false,
            pack: { //  Splash screen and progress bar textures.
                files: [{
                    key: 'background',
                    type: 'image'
                },
                {
                    key: 'progressBar',
                    type: 'image'
                }]
            }
        });
    }

    public preload()
    {
        // Display cover and progress bar textures.
        this.showCover();
        this.showProgressBar();

        // Preload assets

        // Preload custom game assets
        preloadAssets(this);
    }

    public create(): void
    {
        this.input.enabled = false;

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

        // Create anims
        createAnims(this);
    }

    public shutdown(): void
    {
        this.load.removeAllListeners(Phaser.Loader.Events.PROGRESS);
        this.load.removeAllListeners(Phaser.Loader.Events.COMPLETE);
    }

    private showCover()
    {
        this.add.image(0, 0, 'background')
            .setOrigin(0, 0);

        this.add.image(WIDTH / 2, HEIGHT / 5 * 4 + 8, 'whitePixel')
            .setDisplaySize(242, 18);
    }

    private showProgressBar()
    {
        //  Get the progress bar filler texture dimensions.
        const { width: w, height: h } = this.textures.get('progressBar').get();

        //  Place the filler over the progress bar of the splash screen.
        const img = this.add.sprite(WIDTH / 2, HEIGHT / 5 * 4, 'progressBar').setOrigin(0.5, 0);

        // Add percentage text
        const loadingpercentage = this.add.bitmapText(WIDTH / 2, HEIGHT / 5 * 4 - 10, FONTS.GALAXY, 'loading:', FONTS_SIZES.GALAXY, 1)
            .setOrigin(0.5, 0.5)
            .setName('loadingpercentage')
            .setAlpha(1);

        //  Crop the filler along its width, proportional to the amount of files loaded.
        this.load
            .on(Phaser.Loader.Events.PROGRESS, (v: number) =>
            {
                loadingpercentage.text = `loading: ${Math.round(v * 100)}%`;
                img.setCrop(0, 0, Math.ceil(v * w), h);
            })
            .on(Phaser.Loader.Events.COMPLETE, () =>
            {
                this.scene.start(SCENES_NAMES.MENU);
            });
    }
}