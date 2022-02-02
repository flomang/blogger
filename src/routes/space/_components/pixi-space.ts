import * as PIXI from "pixi.js";
import Keyboard from "pixi.js-keyboard";
import { Ship } from "./ship";
import { Hud } from "./hud";
import { StarField } from "./stars";
import { Asteroid } from "./asteroid";
import { random, polyCircle } from "./util";

export class PixiSpace {
    app: PIXI.Application;
    player: Ship;
    starfield: StarField;
    asteroids: Asteroid[];
    hud: Hud;

    constructor({ canvas: canvasElement }) {
        this.app = new PIXI.Application({
            view: canvasElement,
            height: window.screen.height / 9,
            backgroundColor: 0x090f15,
            //resolution: window.devicePixelRatio || 6 
            resolution: 3
        });

        let pos = this.randomPoint(20);
        this.player = new Ship(
            this.app,
            1,
            "rocket.png",
            pos.x,
            pos.y);

        const padding = 3;
        this.hud = new Hud(
            this.app,
            this.app.screen.width - 10 - padding,
            this.app.screen.height - 10 - padding,
            10,
            10);

        this.starfield = new StarField(this.app, 300);

        let asteroids = []
        for (let i = 0; i < 60; i++) {
            let pos = this.randomPoint(0);
            let radius = random(3, 21);
            let asteroid = new Asteroid(this.app, pos.x, pos.y, radius);
            asteroids.push(asteroid);
        }
        this.asteroids = asteroids;

        //Start the game loop
        this.app.ticker.add(delta => this.loop(delta));
    }

    randomPoint(margin: number): any {
        let x = random(margin, this.app.screen.width - margin);
        let y = random(margin, this.app.screen.height - margin);
        return { x: x, y: y };
    }

    loop(delta: number): void {
        this.input(delta);

        this.player.render(delta);
        this.hud.render(delta);
        this.starfield.render(delta);

        for (let i = 0; i < this.asteroids.length; ++i) {
            let asteroid = this.asteroids[i]
            asteroid.render(delta);

            let points = asteroid.vertices();
            let position = this.player.position();

            if (polyCircle(points, position.x, position.y, this.player.radius) && !this.player.destroyed()) {
                this.player.destroy();
            }
        }
    }

    input(delta: number): void {
        // Keyboard
        if (Keyboard.isKeyDown("ArrowLeft", "KeyA")) {
            this.player.setRotation(-0.05 * delta);
        }
        if (Keyboard.isKeyDown("ArrowRight", "KeyD")) {
            this.player.setRotation(0.05 * delta);
        }
        if (Keyboard.isKeyDown("ArrowUp", "KeyW")) {
            this.player.thrust();
        }
        if (Keyboard.isKeyDown("KeyF")) {
            this.player.fire();
        }
        if (Keyboard.isKeyDown("Space")) {
            this.starfield.warp();
        }
        if (Keyboard.isKeyDown("Enter")) {
            if (this.player.destroyed()) {
                let pos = this.randomPoint(20);
                this.player.respawn(pos);
            }
        }

        Keyboard.update();
    }
}
