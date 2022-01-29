import * as PIXI from "pixi.js";
import Keyboard from "pixi.js-keyboard";
import { Ship } from "./ship.js";
import { Hud } from "./hud.js";
import { StarField } from "./stars.js";
import { Asteroid } from "./asteroid.js";
import { random } from "./util";

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

        const player = new Ship({
            clientID: 1,
            app: app,
            image: "rocket.png",
            x: app.screen.width / 2,
            y: app.screen.height / 2
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

        //Start the game loop
        app.ticker.add(delta => loop(delta));

        const asteroids = [];
        for (let i = 0; i < 20; i++) {
            let x = random(0, app.screen.width);
            let y = random(0, app.screen.height);
            let r = random(3, 16);
            let asteroid = new Asteroid({ x: x, y: y, radius: r, app: app });
            asteroids.push(asteroid);
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

            Keyboard.update();
        }

        function loop(delta) {
            input(delta);
            player.render(delta);
            hud.render(delta);
            starField.render(delta);

            for (let i = 0; i < asteroids.length; ++i) {
                asteroids[i].render(delta);

                if ( player.hits(asteroids[i]) && !player.destroyed() ) {
                    player.destroy();
                    //unregisterPlayer(); 
                    //crashSound.play();
                    //coins = coins.concat(player.destroy());
                  }
            }
        }
    }
}
