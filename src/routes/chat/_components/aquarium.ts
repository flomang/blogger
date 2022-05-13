import * as PIXI from "pixi.js";
import * as uuid from 'uuid';
import { Fish } from "./fish";

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
        this.player.render(delta);
    }
}


