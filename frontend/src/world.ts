import { Assets, Sprite, Application, Ticker } from "pixi.js";
import { randomNumber } from "./utils";

interface Bottle {
  sprite: Sprite;
  direction: number;
}

export class World {
  private readonly paths: string[];
  private readonly count: number;
  private readonly background: string;
  private readonly app: Application = new Application();

  constructor(count: number, background: string, paths: string[]) {
    this.count = count;
    this.background = background;
    this.paths = paths;
  }

  public async Run() {
    await this.app.init({ background: this.background, resizeTo: window });
    document.body.appendChild(this.app.canvas);
    const bottles = await this.fillGrid();
    this.app.ticker.add((timer) => this.onTick(timer, bottles));
  }

  private async fillGrid(): Promise<Bottle[]> {
    const bottles: Bottle[] = [];
    for (let index = 0; index < this.count; index++) {
      const index = randomNumber(100_000_000) % this.paths.length;
      const bottle = await this.loadSprite(this.paths[index]);

      this.setupSprite(bottle.sprite);
      this.spawn(screen.width, screen.height, bottle.sprite);
      bottles.push(bottle);
    }

    return bottles;
  }

  private async loadSprite(path: string): Promise<Bottle> {
    await Assets.load(path);
    const sprite = Sprite.from(path);
    this.app.stage.addChild(sprite);
    const direction = Math.floor(Math.random() * 2) == 0 ? 1 : -1;
    return { sprite, direction };
  }

  private setupSprite(sprite: Sprite) {
    sprite.scale.set(0.1);
    sprite.anchor.set(0.5);
  }

  private spawn(width: number, height: number, sprite: Sprite) {
    sprite.x = Math.floor(Math.random() * width);
    sprite.y = Math.floor(Math.random() * height);
  }

  private onTick(time: Ticker, bottles: Bottle[]) {
    for (let index = 0; index < bottles.length; index++) {
      const bottle = bottles[index];
      this.rotate(bottle.sprite, time, bottle.direction);
    }
  }

  private rotate(sprite: Sprite, time: Ticker, direction: number) {
    sprite.rotation += 0.01 * time.deltaTime * direction;
  }
}
