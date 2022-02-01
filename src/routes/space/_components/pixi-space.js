import * as PIXI from "pixi.js";
import Keyboard from "pixi.js-keyboard";
import { Ship } from "./ship.js";
import { Hud } from "./hud.js";
import { StarField } from "./stars.js";
import { Asteroid } from "./asteroid.js";
import { random, polyCircle } from "./util";

export class PixiSpace {
    constructor({ canvas: canvasElement }) {
        let app;
        app = new PIXI.Application({
            view: canvasElement,
            height: window.screen.height / 9,
            backgroundColor: 0x090f15,
            //resolution: window.devicePixelRatio || 6 
            resolution: 3
        });

        let pos = randomPoint(20);
        const player = new Ship({
            clientID: 1,
            app: app,
            image: "rocket.png",
            x: pos.x,
            y: pos.y
        });

        const padding = 3;
        const hud = new Hud({
            app: app,
            x: app.screen.width - 10 - padding,
            y: app.screen.height - 10 - padding,
            w: 10,
            h: 10
        });

        const starField = new StarField({ app: app, count: 300 });

        const asteroids = [];
        for (let i = 0; i < 60; i++) {
            let pos = randomPoint(0);
            let r = random(3, 21);
            let asteroid = new Asteroid({ x: pos.x, y: pos.y, radius: r, app: app });
            asteroids.push(asteroid);
        }

        function randomPoint(margin) {
            let x = random(margin, app.screen.width - margin);
            let y = random(margin, app.screen.height - margin);
            return { x: x, y: y };
        }

        function input(delta) {
            // Keyboard
            if (Keyboard.isKeyDown("ArrowLeft", "KeyA")) {
                player.setRotation(-0.05 * delta);
            }
            if (Keyboard.isKeyDown("ArrowRight", "KeyD")) {
                player.setRotation(0.05 * delta);
            }
            if (Keyboard.isKeyDown("ArrowUp", "KeyW")) {
                player.thrust();
            }
            if (Keyboard.isKeyDown("KeyF")) {
                player.fire();
            }
            if (Keyboard.isKeyDown("Space")) {
                starField.warp();
            }
            if (Keyboard.isKeyDown("Enter")) {
                if (player.destroyed()) {
                    let pos = randomPoint(20);
                    player.respawn(pos);
                }
            }

            Keyboard.update();
        }

        function loop(delta) {
            input(delta);

            player.render(delta);
            hud.render(delta);
            starField.render(delta);

            for (let i = 0; i < asteroids.length; ++i) {
                let asteroid = asteroids[i]
                asteroid.render(delta);

                let points = asteroid.vertices();
                let position = player.position();

                if (polyCircle(points, position.x, position.y, player.radius) && !player.destroyed()) {
                    player.destroy();
                }
            }
        }

        //Start the game loop
        app.ticker.add(delta => loop(delta));
    }
}
