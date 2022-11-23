import { TILE_SIZE } from "../constant/config";
import { DEPTH } from "../constant/depth";
import { IStatus } from "../interfaces/interface";
import GameScene from "../scenes/GameScene";
import SaveLoadService from "../services/SaveLoadService";
import Player from "./Player";

export default function init(scene: GameScene)
{
    const dataJson = SaveLoadService.loadGameData();

    let data: IStatus | undefined;

    if (dataJson)
    {
        data = JSON.parse(dataJson);
    }

    if (!data)
    {
        const newData: IStatus = {
            health: 16,
            life: 3,
            score: 0,
            stage: 1,
            ammo: 5,
            canTakeStairs: false,
            position: {
                x: 2 * TILE_SIZE,
                y: 69 * TILE_SIZE
            }
        }

        SaveLoadService.saveNewGameData(newData);

        data = newData;
    }

    for (let i = 1; i < 16; i += 1)
    {
        try {
            scene.sound.add(i.toString())
        } catch (error) {
            
        }
    }

    const playerA = new Player({
        scene: scene,
        x: data.position.x,
        y: data.position.y,
        texture: 'atlas',
        frame: '',
        buttons: scene.inputController.playerAButtons
    });

    scene.characters.push(playerA);

    // background image
    scene.add.image(0, 0, 'back-moon').setOrigin(0, 0).setScrollFactor(0, 0);

    scene.add.tileSprite(0, 0, scene.map.widthInPixels, 176, 'back-mountain')
        .setOrigin(0, 0)
        .setName('parallax-mountain')
        .setScrollFactor(0.2, 0);

    const castle = scene.add.image(112, 16, 'back-castle')
        .setOrigin(0, 0)
        .setScrollFactor(0.05, 0.3);

    scene.add.image(896 - 256, 912, 'back-castle-entrance').setOrigin(0, 0).setDepth(DEPTH.GROUND_LAYER);
    scene.add.image(896 + 80 - 256, 912 + 112, 'back-castle-entrance-front').setOrigin(0, 0).setDepth(DEPTH.FRONT_LAYER);
    scene.add.image(330 * 16, 0, 'back-clock').setOrigin(0, 0).setDepth(DEPTH.GROUND_LAYER);

    scene.sound.add('SFX30'); // door sound
}