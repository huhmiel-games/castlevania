import { EPossibleState } from "../../../constant/character";
import GameScene from "../../../scenes/GameScene";
import State from "../../../utils/State";
import StateMachine from "../../../utils/StateMachine";
import { Entity } from "../../Entity";

/**
 * @description
 * @author © Philippe Pereira 2022
 * @export
 * @class RecoilRightState
 * @extends {State}
 */
export default class RecoilRightState extends State
{
    public stateMachine: StateMachine;
    public enter(scene: GameScene, character: Entity)
    {
        const { now } = scene.time;

        character.stateTimestamp.setNameAndTime(this.stateMachine.state, now);

        character.setFlipX(true).anims.playReverse(character.animList.RIGHT!, true);

        character.body.setDrag(0, 0).setAcceleration(character.physicsProperties.acceleration, 0);

        console.log(character.name + ' RECOIL RIGHT STATE');
    }

    public execute(scene: GameScene, character: Entity)
    {
        const { right, up, a, b } = character.buttons;

        const { isAttacking } = character.physicsProperties;

        const { blocked } = character.body;

        const { now } = scene.time;

        if (character.canUse(EPossibleState.ATTACK) && a.isDown && up.isUp && a.getDuration(now) < 128)
        {
            this.stateMachine.transition(EPossibleState.ATTACK, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.SECONDARY_ATTACK) && a.isDown && up.isDown && a.getDuration(now) < 128 && !isAttacking)
        {
            this.stateMachine.transition(EPossibleState.SECONDARY_ATTACK, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.IDLE) && right.isUp)
        {
            this.stateMachine.transition(EPossibleState.IDLE, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.JUMP) && b.isDown && b.getDuration(now) < 150)
        {
            this.stateMachine.transition(EPossibleState.JUMP, this.stateMachine.state);

            return;
        }

        if (character.canUse(EPossibleState.FALL) && !blocked.down)
        {
            this.stateMachine.transition(EPossibleState.FALL, this.stateMachine.state);

            return;
        }
    }
}