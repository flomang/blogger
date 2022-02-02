import * as PIXI from "pixi.js";
import { Particle } from "./particle";
import { random } from "./util";
import { sound } from '@pixi/sound';

const RADIAN_OFFSET = Math.PI / 2;

export class Ship {
  app: PIXI.Application;
  container: PIXI.Container;
  radius: number;
  velocity: PIXI.Point;
  clientID: number;
  particles: Particle[];
  heading: PIXI.Point;
  thruster: PIXI.Point;
  isDestroyed: boolean;
  torpedos: Particle[];
  ammoLimit: number = 3;
  recharged: boolean;
  rechargeTime: number = 500;
  sprite: PIXI.Sprite;
  shield: PIXI.Graphics;

  constructor(app: PIXI.Application, clientID: number, image: string, x: number, y: number, radius: number = 2.5) {
    this.app = app;
    this.clientID = clientID;
    this.heading = new PIXI.Point(0, 0);
    this.thruster = new PIXI.Point(0, 0);
    this.velocity = new PIXI.Point(0, 0);
    this.radius = radius;
    this.isDestroyed = false;
    this.particles = [];
    this.torpedos = [];
    this.recharged = true;

    const sprite = PIXI.Sprite.from(image);
    // set the anchor point so the texture is centerd on the sprite
    sprite.x = 0;
    sprite.y = 0;
    sprite.anchor.set(0.5);
    sprite.scale.set(0.01);
    this.sprite = sprite;

    var shield = new PIXI.Graphics();
    shield.beginFill(0xffffff, 0.3);
    shield.drawCircle(0, 0, this.radius + 2.0);
    shield.endFill();
    this.shield = shield;

    this.respawn({ x: x, y: y });
    sound.add('crash', 'pop.mp3');
    sound.add('laser', 'laser.mp3');
    sound.volume('crash', 0.03);
    sound.volume('laser', 0.03);
  }

  respawn = ({ x: x, y: y }) => {
    this.isDestroyed = false;
    this.velocity = new PIXI.Point(0, 0);

    if (this.container != undefined) {
      this.app.stage.removeChild(this.container);
    }

    // the parent container for this asset
    const container = new PIXI.Container();
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
    container.x = x;
    container.y = y;
    container.addChild(this.sprite);
    this.container = container;
    this.app.stage.addChild(container);

    container.addChild(this.shield);

    this.heading.x = Math.cos(this.container.rotation - RADIAN_OFFSET);
    this.heading.y = Math.sin(this.container.rotation - RADIAN_OFFSET);
    this.thruster.x = Math.cos(this.container.rotation + RADIAN_OFFSET);
    this.thruster.y = Math.sin(this.container.rotation + RADIAN_OFFSET);
    this.setRotation(random(0, Math.PI * 2));
  }

  destroy(): void {
    this.isDestroyed = true;
    this.container.removeChild(this.sprite);
    this.container.removeChild(this.shield);

    for (let i = 0; i < 20; ++i) {
      let angle = Math.random() * Math.PI * 2;
      var particle = new Particle(
        this.container.x,
        this.container.y,
        Math.cos(angle),
        Math.sin(angle),
        1,
        1,
        false,
        0.6);

      this.particles.push(particle);
      this.app.stage.addChild(particle.sprite);
    }
    sound.play('crash');
  }

  destroyed(): boolean {
    return this.isDestroyed;
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

  position(): any {
    return { x: this.container.x, y: this.container.y };
  }

  render(delta: number): void {
    this.container.x += this.velocity.x;
    this.container.y += this.velocity.y;
    this.velocity.x *= 0.99;
    this.velocity.y *= 0.99;

    this.edges();

    for (let i = this.particles.length - 1; i >= 0; --i) {
      this.particles[i].render();
      if (this.particles[i].finished()) {
        this.app.stage.removeChild(this.particles[i].sprite);
        this.particles.splice(i, 1);
      }
    }
    this.torpedos.forEach(function (torpedo, i) {
      torpedo.render();
      if (torpedo.offScreen(this.app.screen.width, this.app.screen.height)) {
        this.app.stage.removeChild(torpedo.sprite);
        this.torpedos.splice(i, 1);
      }
    }.bind(this));
  }

  fire(): void {
    if (this.torpedos.length >= this.ammoLimit) {
      return;
    }

    if (!this.recharged) {
      return;
    }

    let pellet = new Particle(
      this.container.x + this.heading.x * 6,
      this.container.y + this.heading.y * 6,
      this.heading.x * 5,
      this.heading.y * 5,
      1,
      1,
      true);

    this.app.stage.addChild(pellet.sprite);
    this.torpedos.push(pellet);

    sound.play('laser');
    this.recharged = false;
    setTimeout(function () {
      this.recharged = true;
    }.bind(this), this.rechargeTime);
  }

  thrust(): void {
    if (this.isDestroyed) {
      return;
    }

    this.velocity.x += this.heading.x * 0.1;
    this.velocity.y += this.heading.y * 0.1;

    for (let i = 0; i < 5; ++i) {
      var particle = new Particle(
        this.container.x - this.heading.x * 6,
        this.container.y - this.heading.y * 6,
        this.thruster.x * ((Math.floor(Math.random() * 51) - 40) / 100),
        this.thruster.y * ((Math.floor(Math.random() * 51) - 40) / 100),
        1,
        1,
        false,
        0.9);

      this.particles.push(particle);
      this.app.stage.addChild(particle.sprite);
    }
  }

  setRotation(radian: number): void {
    // rotate the parent container
    this.container.rotation += radian;
    // set heading vector
    this.heading.x = Math.cos(this.container.rotation - RADIAN_OFFSET);
    this.heading.y = Math.sin(this.container.rotation - RADIAN_OFFSET);
    this.thruster.x = Math.cos(this.container.rotation + RADIAN_OFFSET);
    this.thruster.y = Math.sin(this.container.rotation + RADIAN_OFFSET);
  }

  torpedo(): Particle {
    return new Particle(
      this.container.x + this.heading.x * 6,
      this.container.y + this.heading.y * 6,
      2,
      2,
      this.heading.x * 5,
      this.heading.y * 5,
      true);
  }
}
