import { HUD_EVENTS_NAMES, PLAYER_A_NAME } from "../constant/config";
import GameScene from "../scenes/GameScene";
import { TCoord, TStatus } from "../types/types";
import { Entity } from "./Entity";

export class Status
{
    scene: GameScene;
    entity: Entity;
    health: number;
    life: number;
    ammo: number;
    score: number;
    stage: number;
    canTakeStairs: boolean;
    position: TCoord;
    constructor(scene: GameScene, entity: Entity, status: TStatus)
    {
        this.scene = scene;
        this.entity = entity;
        this.health = status.health;
        this.life = status.life;
        this.ammo = status.ammo;
        this.score = status.score;
        this.stage = status.stage;
        this.canTakeStairs = status.canTakeStairs;
        this.position = status.position;
    }

    public load()
    {

    }

    public save()
    {
        
    }

    public toJson(): TStatus
    {
        const { health, life, ammo, score, stage, canTakeStairs, position } = this;
        return {
            health,
            life,
            ammo,
            score,
            stage,
            canTakeStairs,
            position,
        }
    }

    public setHealth(health: number): Status
    {
        this.health = health;

        if (this.entity.name === PLAYER_A_NAME)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.HEALTH, this.health);
        }

        return this;
    }

    public setLife(life: number): Status
    {
        this.life = life;

        if (this.entity.name === PLAYER_A_NAME)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.LIFE, this.life);
        }

        return this;
    }

    public setAmmo(value: number): Status
    {
        this.ammo = value;

        if (this.entity.name === PLAYER_A_NAME)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.HEART, this.ammo);
        }

        return this;
    }

    public setScore(score: number): Status
    {
        this.score = score;

        if (this.entity.name === PLAYER_A_NAME)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.SCORE, this.score);
        }

        return this;
    }

    public setStage(stage: number): Status
    {
        this.stage = stage;

        return this;
    }

    public setPosition(position: TCoord): Status
    {
        this.position = position;

        return this;
    }
}