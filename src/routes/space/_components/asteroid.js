import * as PIXI from "pixi.js";
import {map} from "./map";



export class Asteroid {
    constructor({
        x: x,
        y: y,
        radius: radius,
        app: app,
    }) {
        this.radius = radius,
        this.app = app;
        let graphics = new PIXI.Graphics();

        this.velocityX = Math.random();
        this.velocityY = Math.random();

        this.total = Math.random() * (15 - 5) + 5; 
        this.offset = [];
        for (var i = 0; i < this.total; i++) {
          this.offset[i] = this.getRandomArbitrary(-this.radius * 0.5, this.radius * 0.5);
        }

        graphics.beginFill(0x2980b9, 0.3); // Yellow
        let points = [];
        for (var i = 0; i < this.total; i++) {
            let angle = map(i, 0, this.total, 0, Math.PI * 2);
            let r = this.radius + this.offset[i];
            let x = r * Math.cos(angle);
            let y = r * Math.sin(angle);
            
            points.push(x);
            points.push(y);
          }

        // Draw a polygon to look like a star
        graphics.drawPolygon(points);
        graphics.endFill();

        // the parent container for this asset
        const container = new PIXI.Container();
        //container.acceleration = new PIXI.Point(0, 0);
        container.pivot.x = container.width / 2;
        container.pivot.y = container.height / 2;
        container.x = x;
        container.y = y;
        container.addChild(graphics);
        this.container = container;
        this.app.stage.addChild(container);
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    render(delta) {
        this.container.x += this.velocityX;
        this.container.y += this.velocityY;
        this.edges();
    }

    edges = () => {
        if (this.container.x > this.app.screen.width + this.radius) {
          this.container.x = -this.radius;
        } else if (this.container.x < -this.radius) {
          this.container.x = this.app.screen.width + this.radius;
        }
        if (this.container.y > this.app.screen.height + this.radius) {
          this.container.y = -this.radius;
        } else if (this.container.y < -this.radius) {
          this.container.y = this.app.screen.height + this.radius;
        }
      }
}