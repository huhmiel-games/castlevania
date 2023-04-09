import { HUD_EVENTS_NAMES, PLAYERS_NAMES } from "../constant/config";
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

        if (this.scene.characters[0] === this.entity)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.HEALTH_PLAYER_A, this.health);
        }

        if (this.scene.characters[1] === this.entity)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.HEALTH_PLAYER_B, this.health);
        }

        return this;
    }

    public setLife(life: number): Status
    {
        this.life = life;

        if (this.scene.characters[0] === this.entity)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.LIFE_PLAYER_A, this.life);
        }

        if (this.scene.characters[1] === this.entity)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.LIFE_PLAYER_B, this.life);
        }

        return this;
    }

    public setAmmo(value: number): Status
    {
        this.ammo = value;

        if (this.scene.characters[0] === this.entity)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.HEART_PLAYER_A, this.ammo);
        }

        if (this.scene.characters[1] === this.entity)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.HEART_PLAYER_B, this.ammo);
        }

        return this;
    }

    public setScore(score: number): Status
    {
        this.score = score;

        if (this.scene.characters[0] === this.entity)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.SCORE_PLAYER_A, this.score);
        }

        if (this.scene.characters[1] === this.entity)
        {
            this.scene.events.emit(HUD_EVENTS_NAMES.SCORE_PLAYER_B, this.score);
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