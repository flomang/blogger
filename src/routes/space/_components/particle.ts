import * as PIXI from "pixi.js";

export class Particle {
    sprite: PIXI.Sprite;
    velocity: PIXI.Point;
    projectile: boolean;

    constructor(
        x: number,
        y: number,
        velocityX: number, 
        velocityY: number,
        width: number,
        height: number,
        projectile: boolean,
        alpha: number = 0.9,
    ) {
        this.velocity = new PIXI.Point(velocityX, velocityY);
        this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE);

        this.sprite.width = width;
        this.sprite.height = height;
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.anchor.set(0.5);
        this.sprite.alpha = alpha;
        this.projectile = projectile;
    }

    offScreen(screenWidth, screenHeight) {
        if (this.sprite.x > screenWidth || 
            this.sprite.y > screenHeight || 
            this.sprite.x < 0 || 
            this.sprite.y < 0) {
            return true;
        } 
        return false;
    }

    render() {
        this.sprite.x += this.velocity.x;
        this.sprite.y += this.velocity.y;

        if (!this.projectile) {
            this.sprite.alpha -= 0.03;
        }
    }

    finished() {
        return this.sprite.alpha < 0;
    }
}