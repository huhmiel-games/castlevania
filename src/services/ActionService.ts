import { WIDTH } from "../constant/config";
import GameScene from "../scenes/GameScene";

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class ActionService
 */
export default class ActionService
{ 
    // public static touchDoor (scene: GameScene, tile: Phaser.Tilemaps.Tile)
    // {
    //     if (scene.isTouchingDoor)
    //     {
    //         return;
    //     }

    //     scene.isTouchingDoor = true;

    //     this.repeatButton(scene, 'btnX');
    // }

    // public static smashDoor (scene: GameScene, player: Player, tile: Phaser.Tilemaps.Tile)
    // {
    //     if (scene.isSmashingDoor)
    //     {
    //         return;
    //     }
    //     scene.isSmashingDoor = true;

    //     this.repeatButton(scene, 'btnX');

    //     player.stateMachine.transition(ECharacterState.SMASHDOOR, player.stateMachine.state)

    // }

    public static repeatButton (scene: GameScene, btnName: string)
    {
        const button: Phaser.GameObjects.Sprite = scene.children.getByName(btnName) as Phaser.GameObjects.Sprite
            || scene.add.sprite(WIDTH / 2, 16, 'abxy', 0).setDepth(1000).setName(btnName).setScrollFactor(0, 0);
        button.setActive(true).setVisible(true);
        
        scene.tweens.add({
            targets: button,
            duration: 250,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0,
            },
            yoyo: true,
            repeat: 2,
            onComplete: () =>
            {
                scene.isTouchingDoor = false;

                button.setActive(false).setVisible(false)
            }
        })
    }
}