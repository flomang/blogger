import * as PIXI from "pixi.js";
import * as uuid from 'uuid';
import { Fish } from "./fish";
import Keyboard from "pixi.js-keyboard";
import { PI_2 } from "pixi.js";

export class Aquarium {
    app: PIXI.Application;
    clientID: String = uuid.v1();
    player: Fish;

    constructor({ canvas: canvasElement }) {
        this.app = new PIXI.Application({
            view: canvasElement,
            width: canvasElement.width,
            height: canvasElement.height,
            backgroundColor: 0x090f15,
            resolution: 6
        });

        this.player = new Fish(
            this.app,
            1,
            "fish.png",
            120,
            120,
            0);

        //Start the game loop
        this.app.ticker.add(delta => this.loop(delta));
    }

    loop(delta: number): void {
        this.input(delta);
        this.player.render(delta);
    }

    input(delta: number): void {
        // Keyboard left key
        if (Keyboard.isKeyPressed("ArrowLeft")) {
            console.log("left");
        } 

        // Keyboard left right 
        if (Keyboard.isKeyPressed("ArrowRight")) {
            console.log("right");
        }

        // Keyboard up right 
        if (Keyboard.isKeyPressed("ArrowUp")) {
            console.log("up");
        }

        if (Keyboard.isKeyPressed("ArrowDown")) {
            console.log("down");
        }

        Keyboard.update();
    }
}
