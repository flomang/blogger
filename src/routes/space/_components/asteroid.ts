import * as PIXI from "pixi.js";
import { map, random } from "./util";

export class Asteroid {
  app: PIXI.Application;
  container: PIXI.Container;
  radius: number;
  velocity: PIXI.Point;
  points: number[];
  color: number = 0x2980b9;

  constructor(
    app: PIXI.Application,
    x: number,
    y: number,
    radius: number,
    points: number[],
    velocityX: number,
    velocityY: number,
  ) {
    this.app = app;
    this.radius = radius,
    //this.velocity = new PIXI.Point(random(-1, 1), random(-1, 1));
    this.velocity = new PIXI.Point(velocityX, velocityY);

    if (points == undefined) {
      let total = random(6, 12);
      this.points = [];
      for (var i = 0; i < total; i++) {
        let angle = map(i, 0, total, 0, Math.PI * 2);
        let offset = random(-this.radius * 0.5, this.radius * 0.5);
        let r = this.radius + offset;
        let x = r * Math.cos(angle);
        let y = r * Math.sin(angle);

        this.points.push(x);
        this.points.push(y);
      }
    } else {
      this.points = points;
    }

    let graphics = new PIXI.Graphics();
    graphics.beginFill(this.color, 0.3);
    graphics.drawPolygon(this.points);
    graphics.endFill();

    // the parent container for this asset
    const container = new PIXI.Container();
    container.x = x;
    container.y = y;
    container.addChild(graphics);
    this.container = container;
    this.app.stage.addChild(container);
  }

  vertices(): number[] {
    let points = [];

    for (var i = 0; i < this.points.length; i += 2) {
      let x = this.container.x + this.points[i];
      let y = this.container.y + this.points[i + 1];
      points.push(x);
      points.push(y);
    }
    return points;
  }

  position(): PIXI.Point {
    return new PIXI.Point(this.container.x, this.container.y);
  }

  render(delta: number): void {
    this.container.x += this.velocity.x;
    this.container.y += this.velocity.y;
    this.edges();
  }

  edges(): void {
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