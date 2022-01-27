import * as PIXI from "pixi.js";
import Keyboard from "pixi.js-keyboard";
import { Ship } from "./ship.js";
import { Hud } from "./hud.js";
import { StarField } from "./stars.js"; 

export class PixiSpace {
    constructor({ canvas: canvasElement }) {
        let app;
        app = new PIXI.Application({
            view: canvasElement,
            backgroundColor: 0x090f15,
            resolution: window.devicePixelRatio || 1
        });

        const player = new Ship({
            clientID: 1,
            app: app,
            image: "rocket.png",
            x: app.screen.width / 2,
            y: app.screen.height / 2
        });

        const padding = 10;
        const hud = new Hud({
            app:app,
            x: app.screen.width - 30 - padding,
            y: app.screen.height - 30 - padding,
            w: 30,
            h: 30
        });

        const starField = new StarField({app: app, count: 20000}); 

        //Start the game loop
        app.ticker.add(delta => loop(delta));

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
        }
    }
}
