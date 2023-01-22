import GameScene from "../../../scenes/GameScene";
import { log } from "../../../utils/log";
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

        for (const key in character.buttons) {
            character.buttons[key].setUp(now);
        }

        // Stop player
        character.body.setMaxVelocity(0, 0);

        if (character.physicsProperties.isAttacking)
        {
            character.meleeWeapon?.body.setEnable(false);

            character.physicsProperties.isAttacking = false;
        }

        character.anims.pause();

        log(character.name + ' STUN STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        if (this.stunTime + 600 < now && !character.physicsProperties.isDead)
        {
            character.anims.resume();

            const {speed, maxSpeedY} = character.config.physicsProperties;
            
            character.body.setMaxVelocity(speed, maxSpeedY || speed);

            this.stateMachine.transition(character.stateMachine.initialState, this.stateMachine.state);
        }
    }
}