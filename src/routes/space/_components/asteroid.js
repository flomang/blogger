import * as PIXI from "pixi.js";
import { map, random } from "./util";

export class Asteroid {
  constructor({
    x: x,
    y: y,
    radius: radius,
    app: app,
  }) {
    this.app = app;
    this.radius = radius,
    this.velocityX = random(-1, 1);
    this.velocityY = random(-1, 1);

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

    let graphics = new PIXI.Graphics();
    graphics.beginFill(0x2980b9, 0.3);
    graphics.drawPolygon(this.points);
    graphics.endFill();

    // the parent container for this asset
    const container = new PIXI.Container();
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
    container.x = x;
    container.y = y;
    container.addChild(graphics);
    this.container = container;
    this.app.stage.addChild(container);
  }

  allPoints() {
    let points = [];

    for (var i = 0; i < this.points.length; i++) {
      let x = this.container.x + this.points[i];
      let y = this.container.y + this.points[i+1];
      points.push(x);
      points.push(y);
    }
    return points;
  }

  position() {
    return { x: this.container.x, y: this.container.y };
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