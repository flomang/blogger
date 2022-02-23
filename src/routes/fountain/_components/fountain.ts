import * as PIXI from "pixi.js";
import * as uuid from 'uuid';

export class Fountain {
    app: PIXI.Application;
    clientID: String = uuid.v1();
    displacementSprite: PIXI.Sprite;
    board: PIXI.Sprite;

    constructor({ canvas: canvasElement }) {
        let padding = 33;

        this.app = new PIXI.Application({
            view: canvasElement,
            width: 1024,
            height: 512,
            backgroundAlpha: 0.0,
            resolution: 1
        });
        const board = PIXI.Sprite.from("static/heartchakra.png");
        board.anchor.set(0.5);
        board.x = this.app.screen.width / 2;
        board.y = this.app.screen.height / 2;
        board.height = this.app.screen.height;
        board.width = this.app.screen.height;
        this.app.stage.addChild(board);
        this.board = board;

        // const water = PIXI.Sprite.from("static/watertexture.png");
        // water.anchor.set(0.5);
        // water.height = this.app.screen.height - padding;
        // water.width = this.app.screen.height - padding;
        // board.addChild(water);

        const displacementSprite = PIXI.Sprite.from('static/displacement_map_repeat.jpeg');
        // Make sure the sprite is wrapping.
        displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

        const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
        displacementFilter.padding = 10;
        displacementSprite.position = board.position;
        displacementFilter.scale.x = 60;
        displacementFilter.scale.y = 70;

        this.app.stage.addChild(displacementSprite);
        board.filters = [displacementFilter];
        this.displacementSprite = displacementSprite;

        //Start the game loop
        this.app.ticker.add(delta => this.loop(delta));
    }

    destroy() {}

    loop(delta: number): void {
        //this.starfield.render(delta);
        this.board.rotation += delta * 0.0003;

        // Offset the sprite position to make vFilterCoord update to larger value. Repeat wrapping makes sure there's still pixels on the coordinates.
        this.displacementSprite.x++;
        // Reset x to 0 when it's over width to keep values from going to very huge numbers.
        if (this.displacementSprite.x > this.displacementSprite.width) this.displacementSprite.x = 0;
    }
}
