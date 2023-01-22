import { ATLAS_NAMES } from "../constant/config";
import { Entity } from "../entities/Entity";
import GameScene from "../scenes/GameScene";

export function bossDeathEffect(scene: GameScene, enemy: Entity)
{
    const { damageBody, depth, width, height } = enemy;
    const { bottom, left, center, top } = damageBody.body;
    const { x, y } = center;

    const countX = Math.round(width / 16);
    const countY = Math.round(height / 16);
    const total = countX * countY;

    const flames: Phaser.GameObjects.Sprite[] = [];

    for (let i = 0; i < total; i += 1)
    {

        const deathFlame: Phaser.GameObjects.Sprite = scene?.enemyDeathGroup.get(0, 0, ATLAS_NAMES.ENEMIES, 'enemy-death-1', false);

        if (deathFlame)
        {
            deathFlame.setOrigin(0.5, 1);
            deathFlame.setActive(true).setVisible(true);
            deathFlame.setDepth(depth - 1);

            deathFlame.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
            {
                deathFlame.setActive(false).setVisible(false);
            });

            deathFlame.anims.play('boss-death', true);

            flames.push(deathFlame);
        }
    }

    Phaser.Actions.GridAlign(flames, {
        width: countX,
        height: countY,
        cellWidth: 16,
        cellHeight: 12,
        position: Phaser.Display.Align.CENTER,
        x: x - width / 2,
        y: y - height / 2
    });
}
