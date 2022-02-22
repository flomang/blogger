import * as PIXI from "pixi.js";
//import { StarField } from "./stars";
import { random } from "../../../lib/util";
import TextInput from "pixi-text-input";
import * as uuid from 'uuid';

export class Ouija {
    app: PIXI.Application;
    //starfield: StarField;
    clientID: String = uuid.v1();
    displacementSprite: PIXI.Sprite;

    constructor({ canvas: canvasElement }) {
        this.app = new PIXI.Application({
            view: canvasElement,
            width: 1024,
            height: 512,
            backgroundAlpha: 0.0,
            resolution: 1
        });
        //this.starfield = new StarField(this.app, 6000);

        const board = PIXI.Sprite.from("static/ouija.png");
        board.anchor.set(0.5);
        board.x = this.app.screen.width / 2;
        board.y = this.app.screen.height / 2 + 30;
        board.height = this.app.screen.height;
        board.width = this.app.screen.width;
        board.scale.set(1.30);
        this.app.stage.addChild(board);

        const displacementSprite = PIXI.Sprite.from('static/displacement_map_repeat.jpeg');
        // Make sure the sprite is wrapping.
        displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
        displacementFilter.padding = 10;
        displacementSprite.position = board.position;
        this.app.stage.addChild(displacementSprite);
        board.filters = [displacementFilter];
        displacementFilter.scale.x = 60;
        displacementFilter.scale.y = 70;
        this.displacementSprite = displacementSprite;

        const planchette = PIXI.Sprite.from("static/planchette.png");
        planchette.x = 706;
        planchette.y = 367;
        planchette.scale.set(0.60);
        planchette.anchor.set(0.5);
        planchette.interactive = true;
        planchette.buttonMode = true;
        planchette.on('pointerdown', onDragStart)
        planchette.on('pointermove', onDragMove);
        this.app.stage.addChild(planchette);

        //Start the game loop
        this.app.ticker.add(delta => this.loop(delta));

        const input = new TextInput({
            input: {
                fontFamily: 'Arial',
                fontSize: '17px',
                padding: '14px 24px',
                width: '300px',
                color: 'white'
            },
            box: generateBox
        })
        
        input.placeholder = 'Enter your question...'
        input.x = 500
        input.y = 30
        input.pivot.x = input.width/2
        input.pivot.y = input.height/2
        this.app.stage.addChild(input)

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

        function onDragMove() {
            if (this.dragging) {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
            }
        }

        function generateBox(w,h,state){
            var box = new PIXI.Container()
            var sprite = new PIXI.TilingSprite(PIXI.Texture.from('tile.png'), w, h)
            var mask = new PIXI.Graphics()
        
            mask.beginFill(0)
            mask.drawRoundedRect(0,0,w,h,33)
        
            box.addChild(sprite)
            box.addChild(mask)
            sprite.mask = mask
        
            switch(state){
                case 'DEFAULT':
                    sprite.tint = 0xffffff
                break;
                case 'FOCUSED':
                    sprite.tint = 0x7EDFFF
                break;
                case 'DISABLED':
                    sprite.alpha = 0.5
                break;
            }
        
            return box
        }
    }

    destroy() { }

    loop(delta: number): void {
        //this.starfield.render(delta);

        // Offset the sprite position to make vFilterCoord update to larger value. Repeat wrapping makes sure there's still pixels on the coordinates.
        this.displacementSprite.x++;
        // Reset x to 0 when it's over width to keep values from going to very huge numbers.
        if (this.displacementSprite.x > this.displacementSprite.width) this.displacementSprite.x = 0;
    }
}
