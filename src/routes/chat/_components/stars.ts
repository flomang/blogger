import * as PIXI from "pixi.js";

class Star{
    container: PIXI.Container;
    sprite: PIXI.Sprite;
    x: number;
    y: number;
    z: number;

    constructor(container: PIXI.Container, sprite: PIXI.Sprite) {
        this.container = container;
        this.sprite = sprite;
        this.randomize(true, 0);
    }

    randomize(initial: boolean, cameraZ: number): void {
        this.z = initial
            ? Math.random() * 2000
            : cameraZ + Math.random() * 1000 + 2000;

        // Calculate star positions with radial random coordinate so no star hits the camera.
        const deg = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 1;
        this.x = Math.cos(deg) * distance;
        this.y = Math.sin(deg) * distance;
    }

}
export class StarField {
    app: PIXI.Application;
    cameraZ: number = 0;
    speed: number = 0;
    warpSpeed: number = 0;
    stars: Star[];

    constructor(app: PIXI.Application, count: number) {
        const starTexture = PIXI.Texture.from("star.png");
        this.app = app;
        this.stars = [];

        // init stars
        for (let i = 0; i < count; i++) {
            const container = new PIXI.Container();
            const sprite = new PIXI.Sprite(starTexture);
            sprite.cursor = 'hover';
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.7;
            sprite.alpha = 0.3;
            sprite.tint = Math.random() * 0xffffff;
            container.addChild(sprite);
            app.stage.addChild(container);

            this.stars.push(new Star(container, sprite));
        }
    }

    warp(): void {
        this.warpSpeed = 1;
        setTimeout(function () {
            this.warpSpeed = 0;
        }.bind(this), 3000);
    }

    render(delta: number): void {
        const baseSpeed = 0.025;
        const starBaseSize = 0.05;
        const starStretch = 5;
        const fov = 20;
        let app = this.app;
        this.speed += (this.warpSpeed - this.speed) / 20;
        this.cameraZ += delta * 10 * (this.speed + baseSpeed);

        this.stars.forEach(function (star: Star) {
            if (star.z < this.cameraZ) star.randomize(false, this.cameraZ);

            // Map star 3d position to 2d with really simple projection
            const z = star.z - this.cameraZ;
            star.container.x =
                star.x * (fov / z) * app.renderer.screen.width +
                app.renderer.screen.width / 2;
            star.container.y =
                star.y * (fov / z) * app.renderer.screen.width +
                app.renderer.screen.height / 2;

            // Calculate star scale & rotation.
            const dxCenter = star.container.x - app.renderer.screen.width / 2;
            const dyCenter = star.container.y - app.renderer.screen.height / 2;
            const distanceCenter = Math.sqrt(
                dxCenter * dxCenter + dyCenter * dyCenter
            );
            const distanceScale = Math.max(0, (2000 - z) / 2000);
            star.sprite.scale.x = distanceScale * starBaseSize;
            // Star is looking towards center so that y axis is towards center.
            // Scale the star depending on how fast we are moving, what the stretchfactor is and depending on how far away it is from the center.
            star.sprite.scale.y =
                distanceScale * starBaseSize +
                (distanceScale * this.speed * starStretch * distanceCenter) /
                app.renderer.screen.width;
            star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
        }.bind(this));
    }
}