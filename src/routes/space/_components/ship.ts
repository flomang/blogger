import * as PIXI from "pixi.js";
import { Particle } from "./particle";
import { random } from "./util";
import { sound } from '@pixi/sound';

const RADIAN_OFFSET = Math.PI / 2;

export class Ship {
  app: PIXI.Application;
  container: PIXI.Container;
  radius: number;
  clientID: number;

  velocity: PIXI.Point;
  heading: PIXI.Point;
  thruster: PIXI.Point;

  destroyPieceCount = 33;
  particles: Particle[];
  torpedos: Particle[];

  ammoLimit: number = 3;
  recharged: boolean;
  isDestroyed: boolean;
  rechargeTime: number = 300;

  sprite: PIXI.Sprite;
  shield: PIXI.Graphics;

  constructor(app: PIXI.Application, clientID: number, image: string, x: number, y: number, radius: number = 2.5) {
    this.app = app;
    this.clientID = clientID;
    this.heading = new PIXI.Point(0, 0);
    this.thruster = new PIXI.Point(0, 0);
    this.velocity = new PIXI.Point(0, 0);
    this.radius = radius;
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

    const container = new PIXI.Container();
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
    container.addChild(this.sprite);
    container.addChild(this.shield);
    this.container = container;

    sound.add('pop', 'pop.mp3');
    sound.add('laser', 'laser.mp3');
    sound.volume('pop', 0.03);
    sound.volume('laser', 0.03);

    this.respawn(new PIXI.Point(x, y));
  }

  respawn(pos: PIXI.Point): void {
    this.isDestroyed = false;
    this.velocity = new PIXI.Point(0, 0);
    this.container.x = pos.x;
    this.container.y = pos.y;

    this.setRotation(random(0, Math.PI * 2));

    this.app.stage.addChild(this.container);
  }

  destroy(): void {
    if (this.isDestroyed) return;

    this.isDestroyed = true;
    this.app.stage.removeChild(this.container);

    for (let i = 0; i < this.destroyPieceCount; ++i) {
      let angle = Math.random() * Math.PI * 2;
      let velocityX = Math.cos(angle);
      let velocityY = Math.sin(angle); 

      var particle = new Particle(
        this.container.x,
        this.container.y,
        velocityX,
        velocityY,
        1,
        1,
        false,
        0.6);

      this.particles.push(particle);
      this.app.stage.addChild(particle.sprite);
    }
    sound.play('pop');
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

  position(): PIXI.Point {
    return new PIXI.Point(this.container.x, this.container.y );
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
    if (this.torpedos.length == this.ammoLimit) {
      return;
    }

    if (!this.recharged) {
      return;
    }

    this.recharged = false;

    let pellet = new Particle(
      this.container.x + this.heading.x * 6,
      this.container.y + this.heading.y * 6,
      this.heading.x * 5,
      this.heading.y * 5,
      2,
      2,
      true);

    this.app.stage.addChild(pellet.sprite);
    this.torpedos.push(pellet);

    sound.play('laser');

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
}
