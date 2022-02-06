import * as PIXI from "pixi.js";
import Keyboard from "pixi.js-keyboard";
import { Ship } from "./ship";
import { Hud } from "./hud";
import { StarField } from "./stars";
import { Asteroid } from "./asteroid";
import { random, polyCircle } from "./util";
import { GameSocket } from "./socket";

const TopicPlayerRegister = "player-register";

export class PixiSpace {
    app: PIXI.Application;
    player: Ship;
    starfield: StarField;
    asteroids: Asteroid[];
    hud: Hud;
    socket: GameSocket;

    onSocketMessage(evt: any): void {
        console.log(evt);
    }
    onSocketConnected(evt: any): void {
        console.log(evt);
    }
    onSocketClosed(evt: any): void {
        console.log(evt);
    }

    destroy() {
        this.socket.close();
    }

    constructor({ canvas: canvasElement }) {
        this.socket = new GameSocket("ws://localhost:8080/ws/");
        this.socket.connect({
            onMessage: this.onSocketMessage,
            onOpen: this.onSocketConnected,
            onClose: this.onSocketClosed
        });

        this.asteroids = [];
        this.app = new PIXI.Application({
            view: canvasElement,
            height: window.screen.height / 9,
            backgroundColor: 0x090f15,
            //resolution: window.devicePixelRatio || 6 
            resolution: 3
        });

        let pos = this.randomPoint(20);
        this.player = new Ship(
            this.app,
            1,
            "rocket.png",
            pos.x,
            pos.y);

        const padding = 3;
        this.hud = new Hud(
            this.app,
            this.app.screen.width - 10 - padding,
            this.app.screen.height - 10 - padding,
            10,
            10);

        this.starfield = new StarField(this.app, 300);

        for (let i = 0; i < 60; i++) {
            let pos = this.randomPoint(0);
            let radius = random(3, 21);
            let asteroid = new Asteroid(this.app, pos.x, pos.y, radius);
            this.asteroids.push(asteroid);
        }

        //Start the game loop
        this.app.ticker.add(delta => this.loop(delta));
    }

    randomPoint(margin: number): PIXI.Point {
        let x = random(margin, this.app.screen.width - margin);
        let y = random(margin, this.app.screen.height - margin);
        return new PIXI.Point(x, y);
    }

    loop(delta: number): void {
        this.input(delta);

        this.player.render(delta);
        this.hud.render(delta);
        this.starfield.render(delta);

        this.asteroids.forEach(function (asteroid: Asteroid) {
            asteroid.render(delta);

            // check collision with asteriod
            let points = asteroid.vertices();
            let playerPos = this.player.position();

            if (polyCircle(points, playerPos.x, playerPos.y, this.player.radius) && !this.player.destroyed()) {
                this.player.destroy();
            }
        }.bind(this));
    }

    input(delta: number): void {
        if (this.player.destroyed()) {
            if (Keyboard.isKeyDown("Enter")) {
                let pos = this.randomPoint(20);
                this.player.respawn(pos);

                this.socket.sendcommand("/register", {
                    name: "flow",
                    screenWidth: this.app.screen.width,
                    screenHeight: this.app.screen.height,
                });
            }
        } else {
            // Keyboard
            if (Keyboard.isKeyDown("ArrowLeft", "KeyA")) {
                this.player.setRotation(-0.05 * delta);
            }
            if (Keyboard.isKeyDown("ArrowRight", "KeyD")) {
                this.player.setRotation(0.05 * delta);
            }
            if (Keyboard.isKeyDown("ArrowUp", "KeyW")) {
                this.player.thrust();
            }
            if (Keyboard.isKeyDown("KeyW")) {
                this.starfield.warp();
            }
            if (Keyboard.isKeyDown("Space")) {
                this.player.fire();
            }
        }

        Keyboard.update();
    }
}
