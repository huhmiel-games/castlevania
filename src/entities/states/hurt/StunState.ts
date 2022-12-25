import GameScene from "../../../scenes/GameScene";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class StunState
 * @extends {State}
 */
export default class StunState extends State
{
    private stunTime: number;
    public stateMachine: StateMachine;

    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        this.stunTime = now;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        // Stop player
        character.body.setDragX(100000);

        if (character.physicsProperties.isAttacking)
        {
            character.meleeWeapon?.body.setEnable(false);

            character.physicsProperties.isAttacking = false;
        }

        if(character.animList.IDLE)
        {
            character.anims.play(character.animList.IDLE, true);
        }

        console.log(character.name + ' STUN STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        if (this.stunTime + 600 < now && !character.physicsProperties.isDead)
        {
            character.body.setDragX(0);

            this.stateMachine.transition(character.stateMachine.prevState, this.stateMachine.state);
        }
    }
}