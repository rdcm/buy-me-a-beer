import { Assets, Sprite, Application, Ticker } from "pixi.js";
import { randomNumber } from "./utils";

export class World {
  private readonly paths: string[];
  private readonly bottles: number;
  private readonly background: string;
  private readonly app: Application = new Application();

  constructor(bottles: number, background: string, paths: string[]) {
    this.bottles = bottles;
    this.background = background;
    this.paths = paths;
  }

  public async Run() {
    await this.app.init({ background: this.background, resizeTo: window });
    document.body.appendChild(this.app.canvas);
    const sprites = await this.fillGrid();
    this.app.ticker.add((timer) => this.onTick(timer, sprites));
  }

  private async fillGrid(): Promise<[Sprite, number][]> {
    const sprites: [Sprite, number][] = [];
    for (let index = 0; index < this.bottles; index++) {
      const index = randomNumber(100_000_000) % this.paths.length;
      console.log("length: ", index);
      const pair = await this.loadSprite(this.paths[index]);

      this.setupSprite(pair[0]);
      this.spawn(this.app.screen.width, this.app.screen.height, pair[0]);
      sprites.push(pair);
    }

    return sprites;
  }

  private async loadSprite(path: string): Promise<[Sprite, number]> {
    await Assets.load(path);
    const sprite = Sprite.from(path);
    this.app.stage.addChild(sprite);
    const direction = Math.floor(Math.random() * 2) == 0 ? 1 : -1;
    return [sprite, direction];
  }

  private setupSprite(sprite: Sprite) {
    sprite.scale.set(0.1);
    sprite.anchor.set(0.5);
  }

  private spawn(width: number, height: number, sprite: Sprite) {
    sprite.x = Math.floor(Math.random() * width);
    sprite.y = Math.floor(Math.random() * height);
  }

  private onTick(time: Ticker, sprites: [Sprite, number][]) {
    for (let index = 0; index < sprites.length; index++) {
      const pair = sprites[index];
      this.rotate(pair[0], time, pair[1]);
    }
  }

  private rotate(sprite: Sprite, time: Ticker, direction: number) {
    sprite.rotation += 0.01 * time.deltaTime * direction;
  }
}
