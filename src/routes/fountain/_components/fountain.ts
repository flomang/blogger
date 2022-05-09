import * as PIXI from "pixi.js";
import * as uuid from 'uuid';

export class Fountain {
    app: PIXI.Application;
    clientID: String = uuid.v1();
    displacementSprite: PIXI.Sprite;
    heart: PIXI.Sprite;

    constructor({ canvas: canvasElement }) {
        let padding = 33;

        this.app = new PIXI.Application({
            view: canvasElement,
            width: 1024,
            height: 512,
            backgroundAlpha: 0.0,
            resolution: 1
        });

        let main = new PIXI.Container();
        this.app.stage.addChild(main);

        const heart = PIXI.Sprite.from("heartchakra.png");
        heart.anchor.set(0.5);
        heart.x = this.app.screen.width / 2;
        heart.y = this.app.screen.height / 2;
        heart.height = this.app.screen.height;
        heart.width = this.app.screen.height;
        main.addChild(heart);
        this.heart = heart;

        const displacementSprite = PIXI.Sprite.from('displacement_map_repeat.jpeg');
        // Make sure the sprite is wrapping.
        displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

        const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
        displacementFilter.padding = 10;
        displacementSprite.position = heart.position;
        displacementFilter.scale.x = 60;
        displacementFilter.scale.y = 70;

        this.app.stage.addChild(displacementSprite);
        heart.filters = [displacementFilter];
        this.displacementSprite = displacementSprite;

        //Start the game loop
        this.app.ticker.add(delta => this.loop(delta));
    }

    destroy() {}

    loop(delta: number): void {
        //this.starfield.render(delta);
        this.heart.rotation -= delta * 0.0003;

        // Offset the sprite position to make vFilterCoord update to larger value. Repeat wrapping makes sure there's still pixels on the coordinates.
        this.displacementSprite.x++;
        // Reset x to 0 when it's over width to keep values from going to very huge numbers.
        if (this.displacementSprite.x > this.displacementSprite.width) this.displacementSprite.x = 0;
    }
}
