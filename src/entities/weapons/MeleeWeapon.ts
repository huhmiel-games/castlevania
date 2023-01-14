import { EPossibleState } from "../../constant/character";
import { DEPTH } from "../../constant/depth";
import destroyCandle from "../../custom/destroyCandle";
import GameScene from "../../scenes/GameScene";
import { Entity } from "../Entity";
import Weapon from "./Weapon";

export class MeleeWeapon extends Phaser.GameObjects.Image implements Weapon
{
    public scene: GameScene;
    public body: Phaser.Physics.Arcade.Body;
    public weaponGroup: Phaser.GameObjects.Group;
    public parent: Entity;
    public damage: number = 1.5;
    constructor(config: { scene: GameScene; parent: Entity, x: number; y: number; texture: string; frame: string; })
    {
        super(config.scene, config.x, config.y, config.texture, config.frame);

        this.parent = config.parent;

        this.scene.add.existing(this);

        this.scene.physics.world.enable(this);

        this.setActive(true).setDepth(DEPTH.WEAPON);

        this.body.setAllowGravity(false).setEnable(false);

        this.scene.playersWeaponGroup.add(this);

        this.onPostUpdateEvent();
    }

    private onPostUpdateEvent()
    {
        this.scene.events.on(Phaser.Scenes.Events.POST_UPDATE, this.changePosition, this);
    }

    private changePosition()
    {
        const { body, flipX } = this.parent;

        const currentState = this.parent.stateMachine.state;

        this.changePositionY(body, currentState);

        this.changePositionX(body, flipX);
    }

    private changePositionX(body: Phaser.Physics.Arcade.Body | undefined, flipX: boolean)
    {
        if (body === undefined) return;

        if (flipX && this.x !== body.x - this.width)
        {
            this.x = body.x - this.width;

            return;
        }

        if (!flipX && this.x !== body.x + body.width)
        {
            this.x = body.right;
        }
    }

    private changePositionY(body: Phaser.Physics.Arcade.Body | undefined, currentState: EPossibleState)
    {
        if (body === undefined) return;

        const stateConditionnal = [
            EPossibleState.ATTACK,
            EPossibleState.JUMP_ATTACK,
            EPossibleState.JUMP_MOMENTUM_ATTACK,
            EPossibleState.FALL_ATTACK,
            EPossibleState.STAIR_ATTACK
        ];

        if (this.y !== body.y - body.halfHeight && stateConditionnal.includes(currentState))
        {
            this.y = body.y - body.halfHeight;

            return;
        }

        if (this.y !== body.y && currentState === EPossibleState.CROUCH_ATTACK)
        {
            this.y = body.y;
        }
    }

    public destroyObject(_candle: unknown)
    {
        destroyCandle(this.scene, this, _candle)
    }

    public destroyTile(_tile: Phaser.Tilemaps.Tile)
    {

    }

    public attack: () => void;

    public setDisable()
    {
        this.body.setEnable(false);

        this.setActive(false).setVisible(false);
    }
}