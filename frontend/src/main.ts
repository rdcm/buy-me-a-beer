import { Sprite, Renderer, Application, Ticker } from 'pixi.js';
import * as PIXI from 'pixi.js';

const PATHS: string[] = [ 'vanila.png', 'black.png', 'chili.png'];
const SPRITES: [Sprite, number][] = [];
const BOTTLES = 100;
const BACKGROUND = '#1099bb';

(async () => {
    const app = await buildApp(BACKGROUND);
    await fillGrid(app, BOTTLES);

    app.ticker.add(onTick);
})();

async function buildApp(background: string): Promise<Application> {
    const app = new Application();
    await app.init({ background: background, resizeTo: window })
    document.body.appendChild(app.canvas);
    return app;
}

async function loadSprite(app: Application<Renderer>, path: string): Promise<[Sprite, number]> {
    await PIXI.Assets.load(path);
    const sprite = PIXI.Sprite.from(path);
    app.stage.addChild(sprite);
    const direction = Math.floor(Math.random() * 2) == 0 ? 1 : -1;
    return [sprite, direction];
}

async function fillGrid(app: Application<Renderer>, bottles: number) {
    for (let index = 0; index < bottles; index++) {
        const index = randomNumber(Number.MIN_VALUE, Number.MAX_VALUE) % PATHS.length;
        const pair = await loadSprite(app, PATHS[index])

        setupSprite(pair[0]);
        spawn(app.screen.width, app.screen.height, pair[0]);
        SPRITES.push(pair);
    }
}

function setupSprite(sprite: Sprite) {
    sprite.scale.set(0.1);
    sprite.anchor.set(0.5);
}

function spawn(width: number, height: number, sprite: Sprite) {
    sprite.x = Math.floor(Math.random() * width);
    sprite.y = Math.floor(Math.random() * height);
}

function rotate(sprite: Sprite, time: Ticker, direction: number) {
    sprite.rotation += (0.01 * time.deltaTime) * direction;
}

function onTick(time: Ticker) {
    for (let index = 0; index < SPRITES.length; index++) {
        const pair = SPRITES[index];
        rotate(pair[0], time, pair[1])
    }
}

function randomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }