import * as PIXI from "pixi.js";
import { StarField } from "./stars";
import * as uuid from 'uuid';

export class Aquarium {
    app: PIXI.Application;
    starfield: StarField;
    clientID: String = uuid.v1();

    destroy() {}

    constructor({ canvas: canvasElement }) {
        this.app = new PIXI.Application({
            view: canvasElement,
            width: canvasElement.width,
            height: canvasElement.height,
            backgroundColor: 0x090f15,
            resolution: 6 
        });

        this.starfield = new StarField(this.app, 300);

        //Start the game loop
        this.app.ticker.add(delta => this.loop(delta));
    }

    loop(delta: number): void {
        this.starfield.render(delta);
    }
}
