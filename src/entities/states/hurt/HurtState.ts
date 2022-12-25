import { EPossibleState } from "../../../constant/character";
import GameScene from "../../../scenes/GameScene";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class HurtState
 * @extends {State}
 */
export default class HurtState extends State
{
    private hitTime: number;
    public stateMachine: StateMachine;

    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        // Stop player
        character.body.setDrag(0).setAcceleration(0, 0);

        if (character.physicsProperties.isAttacking)
        {
            character.meleeWeapon?.body.setEnable(false);

            character.physicsProperties.isAttacking = false;
        }

        this.hitTime = now;

        character.body.setDrag(0, 0).setMaxVelocityY(character.physicsProperties.speed * 4);

        const speedX = character.flipX ? character.physicsProperties.speed * 2 : character.physicsProperties.speed * -2;

        character.body.setVelocity(speedX, -character.physicsProperties.speed * 6);

        character.anims.play(character.animList.HURT!, true);

        console.log(character.name + ' HURT STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { blocked } = character.body;

        const { now } = scene.time;

        if (this.hitTime + 600 < now && !character.physicsProperties.isDead)
        {
            character.body.setVelocity(0, 0);

            if (blocked.down)
            {
                this.stateMachine.transition(EPossibleState.IDLE, this.stateMachine.state);
            }
            else
            {
                this.stateMachine.transition(EPossibleState.FALL, this.stateMachine.state);
            }
        }
    }
}