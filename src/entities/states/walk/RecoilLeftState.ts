import { EStates } from "../../../constant/character";
import GameScene from "../../../scenes/GameScene";
import { log } from "../../../utils/log";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class RecoilLeftState
 * @extends {State}
 */
export default class RecoilLeftState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.setFlipX(false).anims.playReverse(character.animList.LEFT!, true);

        character.body.setDrag(0, 0).setAcceleration(-character.physicsProperties.acceleration, 0);

        log(character.name + ' RECOIL LEFT STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { left, up, a, b } = character.buttons;

        const { isAttacking } = character.physicsProperties;

        const { blocked } = character.body;

        const { now } = scene.time;

        if (character.canUse(EStates.ATTACK) && a.isDown && up.isUp && a.getDuration(now) < 128)
        {
            this.stateMachine.transition(EStates.ATTACK, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.SECONDARY_ATTACK) && a.isDown && up.isDown && a.getDuration(now) < 128 && !isAttacking)
        {
            this.stateMachine.transition(EStates.SECONDARY_ATTACK, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.IDLE) && left.isUp)
        {
            this.stateMachine.transition(EStates.IDLE, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.JUMP) && b.isDown && b.getDuration(now) < 150)
        {
            this.stateMachine.transition(EStates.JUMP, this.stateMachine.state);

            return;
        }

        if (character.canUse(EStates.FALL) && !blocked.down)
        {
            this.stateMachine.transition(EStates.FALL, this.stateMachine.state);

            return;
        }
    }
}