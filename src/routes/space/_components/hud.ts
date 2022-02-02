import * as PIXI from "pixi.js";

export class Hud {
    app: PIXI.Application;
    container: PIXI.Container;
    ring: PIXI.Container;
    flip: boolean;

    constructor(app: PIXI.Application, x: number, y: number, width: number, height: number) {
        const btc = PIXI.Sprite.from("btc.png");
        btc.anchor.set(0.5);
        btc.width = width;
        btc.height = height;

        const container = new PIXI.Container();
        container.x = x;
        container.y = y;
        container.addChild(btc);
        app.stage.addChild(container);

        let ring = new PIXI.Container();
        ring.x = x;
        ring.y = y;
        app.stage.addChild(ring);

        let increment = Math.PI / 10;
        let coinCount = 3;
        for (let i = 0; i < coinCount; i++) {
            const btcd = PIXI.Sprite.from("btc.png");
            btcd.tint = 0x7ac6fa;
            btcd.width = width/4;
            btcd.height = height/4;
            btcd.anchor.set(0.5);
            btcd.x = width * Math.cos(increment * i);
            btcd.y = height * Math.sin(increment * i);
            ring.addChild(btcd);
        }

        this.app = app;
        this.container = container;
        this.ring = ring;
        this.flip = true;
    }

    render(delta: number):void {
        this.ring.rotation += 0.1;

        const container = this.container;
        if (container.scale.x > -1 && this.flip) {
            container.scale.x -= 0.05;
            if (container.scale.x <= -1) {
                this.flip = false;
            }
        } else if (container.scale.x < 1 && !this.flip) {
            container.scale.x += 0.05;
            if (container.scale.x >= 1) {
                this.flip = true;
            }
        }
    }
}