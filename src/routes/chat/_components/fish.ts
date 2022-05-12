import * as PIXI from "pixi.js";

const RADIAN_OFFSET = Math.PI / 2;

export class Fish {
  app: PIXI.Application;
  container: PIXI.Container;
  radius: number;
  clientID: number;

  velocity: PIXI.Point;
  heading: PIXI.Point;
  thruster: PIXI.Point;

  throttle: boolean;
  isTurningLeft: boolean;
  isTurningRight: boolean;

  sprite: PIXI.Sprite;
  scale: number = 0.055;

  constructor(app: PIXI.Application, clientID: number, image: string, x: number, y: number, rotation: number) {
    this.app = app;
    this.clientID = clientID;
    this.velocity = new PIXI.Point(0, 0);
    this.heading = new PIXI.Point(-1, -1);

    const sprite = PIXI.Sprite.from(image);
    // set the anchor point so the texture is centerd on the sprite
    sprite.x = 0;
    sprite.y = 0;
    sprite.anchor.set(0.5);
    sprite.scale.set(this.scale);
    this.sprite = sprite;

    const container = new PIXI.Container();
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
    container.addChild(this.sprite);
    this.container = container;
    this.container.x = x;
    this.container.y = y;

    this.setRotation(rotation);
    this.app.stage.addChild(this.container);
  }

  edges(): void {
    if (this.container.x > this.app.screen.width + this.sprite.width) {
      this.container.x = -this.sprite.width;
    } else if (this.container.x < -this.sprite.width) {
      this.container.x = this.app.screen.width + this.sprite.width;
    }
    if (this.container.y > this.app.screen.height + this.sprite.width) {
      this.container.y = -this.sprite.width;
    } else if (this.container.y < -this.sprite.width) {
      this.container.y = this.app.screen.height + this.sprite.width;
    }
  }

  render(delta: number): void {
    this.container.x += (this.velocity.x * delta);
    this.container.y += (this.velocity.y * delta);
    this.velocity.x *= 0.99;
    this.velocity.y *= 0.99;

    this.edges();
  }

  setRotation(radian: number): void {
    // rotate the parent container
    this.container.rotation += radian;
    // set heading vector
    this.heading.x = Math.cos(this.container.rotation - RADIAN_OFFSET);
    this.heading.y = Math.sin(this.container.rotation - RADIAN_OFFSET);
  }
}
