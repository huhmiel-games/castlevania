import { STAGE_COUNTDOWN_DEFAULT, COUNTDOWN_EVENT, HUD_EVENTS_NAMES, PLAYER_A_NAME } from "../constant/config";
import GameScene from "../scenes/GameScene"
import SaveLoadService from "../services/SaveLoadService";

export class StageCountDown
{
    private scene: GameScene
    private countDown: number
    private timer: Phaser.Time.TimerEvent

    constructor(scene: GameScene)
    {
        this.scene = scene;
        this.countDown = SaveLoadService.getStageCountDown();
    }

    public getCountDown()
    {
        return this.countDown;
    }

    public decrementCountdown()
    {
        this.countDown -= 1;
    }

    private start()
    {
        this.timer = this.scene.time.addEvent({
            delay: 1000,
            repeat: this.countDown,
            callback: this.emitCountDownEvent,
            callbackScope: this
        })
    }

    public stop()
    {
        this.timer?.remove(false);
    }

    public restart()
    {
        this.stop();

        this.countDown = SaveLoadService.getStageCountDown();

        this.start();
    }

    public reset(withStart: boolean = false, value: number = STAGE_COUNTDOWN_DEFAULT)
    {
        this.stop();

        this.countDown = value;

        SaveLoadService.setStageCountDown(value);

        if(withStart)
        {
            this.start();
        }
    }

    public save()
    {
        SaveLoadService.setStageCountDown(this.countDown);
    }

    private emitCountDownEvent()
    {
        this.countDown -= 1;

        if(this.countDown < 30)
        {
            this.scene.playSound(35)
        }

        if(this.countDown === 0)
        {
            const player = this.scene.getPlayerByName(PLAYER_A_NAME);

            player.setStatusHealthDamage(16);
        }

        this.scene.events.emit(COUNTDOWN_EVENT, this.countDown);
    }
}