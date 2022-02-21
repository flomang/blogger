import * as PIXI from "pixi.js";
import Keyboard from "pixi.js-keyboard";
import { StarField } from "./stars";
import { random } from "./util";
import * as uuid from 'uuid';

export class Ouija {
    app: PIXI.Application;
    starfield: StarField;
    clientID: String = uuid.v1();

    constructor({ canvas: canvasElement }) {
        this.app = new PIXI.Application({
            view: canvasElement,
            width: 1024,
            height: 512,
            backgroundAlpha: 0.0,
            resolution: 6
        });
        //const defaultIcon = "url('static/planchette.png'),auto";
        //this.app.renderer.plugins.interaction.cursorStyles.default = defaultIcon;
        const board = PIXI.Sprite.from("static/ouija.png");
        board.anchor.set(0.5);
        board.x = this.app.screen.width / 2;
        board.y = this.app.screen.height / 2;
        board.height = this.app.screen.height;
        board.width = this.app.screen.width;
        board.scale.set(1.30);
        this.app.stage.addChild(board);

        this.starfield = new StarField(this.app, 600);

        const planchette = PIXI.Sprite.from("static/planchette.png");
        planchette.x = this.app.screen.width / 2;
        planchette.y = this.app.screen.height / 2;
        planchette.scale.set(0.60);
        planchette.anchor.set(0.5);
        planchette.interactive = true;
        planchette.buttonMode = true;
        planchette.on('pointerdown', onDragStart)
        //planchette.on('pointerup', onDragEnd)
        //planchette.on('pointerupoutside', onDragEnd)
        planchette.on('pointermove', onDragMove);
        this.app.stage.addChild(planchette);

        //Start the game loop
        this.app.ticker.add(delta => this.loop(delta));

        function onDragStart(event) {
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = event.data;
            this.dragging = !this.dragging;

            if (this.dragging)
                this.alpha = 0.5;
            else
                this.alpha = 1.0;
        }

        function onDragEnd() {
            this.alpha = 1;
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
        }

        function onDragMove() {
            if (this.dragging) {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
            }
        }

    }

    destroy() { }

    loop(delta: number): void {
        this.starfield.render(delta);
    }
}
