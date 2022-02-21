import * as PIXI from "pixi.js";
import Keyboard from "pixi.js-keyboard";
import { Ship } from "./ship";
import { Hud } from "./hud";
import { StarField } from "./stars";
import { Asteroid } from "./asteroid";
import { random, polyCircle } from "../../../lib/util";
import { GameSocket } from "./socket";
import * as uuid from 'uuid';

// client messages 
const CMPlayerDied = "PlayerDied";
const CMPlayerRegister = "RegisterPlayer";
const CMPlayerRespawn = "RespawnPlayer";
const CMPlayerArrowUp = "PlayerKeyboardArrowUp";
const CMPlayerArrowLeft = "PlayerKeyboardArrowLeft";
const CMPlayerArrowRight = "PlayerKeyboardArrowRight";

// server messages 
const SMPlayerRegistered = "PlayerRegistered";
const SMPlayerUnregistered = "PlayerUnregistered";
const SMPlayerDied = "PlayerDied";
const SMPlayerRespawned = "PlayerRespawned";
const SMPlayerMoveForward = "PlayerMoveForward";
const SMPlayerRotateLeft = "PlayerRotateLeft";
const SMPlayerRotateRight = "PlayerRotateRight";
const SMAsteroid = "Asteroid";

export class PixiSpace {
    app: PIXI.Application;
    starfield: StarField;
    asteroids: Asteroid[] = [];
    hud: Hud;
    socket: GameSocket;
    player: Ship;
    players: Ship[] = [];
    clientID: String = uuid.v1();

    onSocketMessage(evt: any): void {
        console.log(evt);
        try {
            const json = JSON.parse(evt.data);
            //for (const json of jsonres) {
            switch (json.type) {
                case SMPlayerRegistered: {
                    let player = new Ship(
                        this.app,
                        json.id,
                        "rocket.png",
                        json.x,
                        json.y,
                        json.rotation,
                        6);

                    this.players.push(player);

                    if (this.clientID == json.id) {
                        this.player = player;
                    }
                    break;
                }
                case SMPlayerUnregistered: {
                    for (let i = 0; i < this.players.length; ++i) {
                        if (this.players[i].clientID == json.id) {
                            this.players.splice(i, 1);
                            break;
                        }
                    }

                    if (this.clientID == json.id) {
                        this.player == undefined;
                    }
                    break;
                }
                case SMPlayerRespawned: {
                    let player = this.players.find( p => p.clientID == json.id);
                    player.respawn(new PIXI.Point(json.x, json.y), json.rotation);
                    break;
                }
                case SMPlayerDied: {
                    let player = this.players.find( p => p.clientID == json.id);
                    player.destroy();
                    break;
                }
                case SMPlayerMoveForward: {
                    let player = this.players.find( p => p.clientID == json.id);
                    player.boosting(json.isMoving);
                    break;
                }
                case SMPlayerRotateLeft: {
                    let player = this.players.find( p => p.clientID == json.id);
                    player.setRotationLeft(json.isRotating);
                    break;
                }
                case SMPlayerRotateRight: {
                    let player = this.players.find( p => p.clientID == json.id);
                    player.setRotationRight(json.isRotating);
                    break;
                }
                case SMAsteroid: {
                    let pos = this.randomPointOffscreen();
                    let asteroid = new Asteroid(this.app, pos.x, pos.y, json.radius, json.points, json.velocityX, json.velocityY);
                    this.asteroids.push(asteroid);
                    break;
                }

                default:
            }
            //}
        }
        catch (err) {
            // 12/7/18
            // ignore SyntaxError: Unexpected token {
            // results from JSON.parse above
            // this might be fixed now that the messages are handled as an array
            console.log(`ERROR: ${err}`);
        }
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
            onMessage: this.onSocketMessage.bind(this),
            onOpen: this.onSocketConnected.bind(this),
            onClose: this.onSocketClosed.bind(this)
        });

        this.asteroids = [];
        this.app = new PIXI.Application({
            view: canvasElement,
            width: 1024,
            height: 512,
            backgroundColor: 0x090f15,
            //resolution: window.devicePixelRatio || 6 
            resolution:  6
        });

        const padding = 3;
        this.hud = new Hud(
            this.app,
            this.app.screen.width - 10 - padding,
            this.app.screen.height - 10 - padding,
            10,
            10);

        this.starfield = new StarField(this.app, 300);

        // for (let i = 0; i < 60; i++) {
        //     let pos = this.randomPoint(0);
        //     let radius = random(3, 21);
        //     let asteroid = new Asteroid(this.app, pos.x, pos.y, radius);
        //     this.asteroids.push(asteroid);
        // }

        //Start the game loop
        this.app.ticker.add(delta => this.loop(delta));
    }

    randomPoint(margin: number): PIXI.Point {
        let x = random(margin, this.app.screen.width - margin);
        let y = random(margin, this.app.screen.height - margin);
        return new PIXI.Point(x, y);
    }

    randomPointOffscreen(): PIXI.Point {
        let x = random(0, this.app.screen.width);
        let y = random(0, this.app.screen.height);

        if (Math.random() < 0.5) {
            x -= this.app.screen.width;
        } else {
            y -= this.app.screen.height;
        }

        return new PIXI.Point(x, y);
    }

    loop(delta: number): void {
        this.input(delta);
        this.hud.render(delta);
        this.starfield.render(delta);

        this.players.forEach(function (player: Ship) {
            player.render(delta);
        });

        this.asteroids.forEach(function (asteroid: Asteroid) {
            asteroid.render(delta);

            if (this.player != undefined) {
                // check collision with asteriod
                let points = asteroid.vertices();
                let playerPos = this.player.position();

                if (polyCircle(points, playerPos.x, playerPos.y, this.player.radius) && !this.player.destroyed()) {
                    this.socket.sendmessages("/messages", [
                        {
                            id: this.clientID,
                            type: CMPlayerDied,
                        },
                    ]);
                }
            }
        }.bind(this));
    }

    input(delta: number): void {
        if (this.player == undefined || this.player.destroyed()) {
            if (Keyboard.isKeyDown("Enter")) {
                let pos = this.randomPoint(20);

                if (this.player == undefined) {
                    this.socket.sendmessages("/messages", [
                        {
                            id: this.clientID,
                            type: CMPlayerRegister,
                            name: "flow",
                            x: pos.x,
                            y: pos.y,
                        },
                    ]);
                } else if (!this.player.isDead()) {

                    this.socket.sendmessages("/messages", [
                        {
                            id: this.clientID,
                            type: CMPlayerRespawn,
                            x: pos.x,
                            y: pos.y,
                        },
                    ]);
                }
            }
        } else {
            // Keyboard left key
            if (Keyboard.isKeyPressed("ArrowLeft", "KeyA")) {
                this.socket.sendmessages("/messages", [{ id: this.clientID, type: CMPlayerArrowLeft, keyDown: true}] );
            } else if (Keyboard.isKeyReleased("ArrowLeft", "KeyA")) {
                this.socket.sendmessages("/messages", [{ id: this.clientID, type: CMPlayerArrowLeft, keyDown: false}] );
            }

            // Keyboard left right 
            if (Keyboard.isKeyPressed("ArrowRight", "KeyD")) {
                this.socket.sendmessages("/messages", [{ id: this.clientID, type: CMPlayerArrowRight, keyDown: true}] );
            } else if (Keyboard.isKeyReleased("ArrowRight", "KeyD")) {
                this.socket.sendmessages("/messages", [{ id: this.clientID, type: CMPlayerArrowRight, keyDown: false}] );
            }

            // Keyboard up right 
            if (Keyboard.isKeyPressed("ArrowUp", "KeyW")) {
                this.socket.sendmessages("/messages", [{ id: this.clientID, type: CMPlayerArrowUp, keyDown: true}] );
            }  else if (Keyboard.isKeyReleased("ArrowUp", "KeyW")) {
                this.socket.sendmessages("/messages", [{ id: this.clientID, type: CMPlayerArrowUp, keyDown: false}] );
            }

            if (Keyboard.isKeyDown("KeyW")) {
                this.starfield.warp();
            }
            if (Keyboard.isKeyDown("KeyF")) {
                this.player.fire();
            }
        }

        Keyboard.update();
    }
}
