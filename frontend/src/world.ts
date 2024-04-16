import { Assets, Sprite, Application, Ticker } from "pixi.js";
import { randomNumber, randomNumberInRange } from "./utils";

declare module "pixi.js" {
  interface Sprite {
    direction: number;
    velocityX: number;
    velocityY: number;
  }
}

export class World {
  private readonly sprites: Sprite[] = [];
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
    await this.app.init({
      background: this.background,
      width: screen.width,
      height: screen.height,
    });
    document.body.appendChild(this.app.canvas);
    await this.fillGrid();
    this.app.ticker.add((timer) => this.onTick(timer));
  }

  private async fillGrid() {
    for (let index = 0; index < this.count; index++) {
      const index = randomNumber(100_000_000) % this.paths.length;
      const sprite = await this.loadSprite(this.paths[index]);

      this.setupSprite(sprite);
      this.spawn(screen.width, screen.height, sprite);
      this.sprites.push(sprite);
    }
  }

  private async loadSprite(path: string): Promise<Sprite> {
    await Assets.load(path);
    const sprite = Sprite.from(path);
    this.app.stage.addChild(sprite);
    sprite.direction = Math.floor(Math.random() * 2) == 0 ? 1 : -1;
    sprite.velocityX = randomNumberInRange(-1, 1, 0);
    sprite.velocityY = randomNumberInRange(-1, 1, 0);
    return sprite;
  }

  private setupSprite(sprite: Sprite) {
    sprite.scale.set(0.07);
    sprite.anchor.set(0.5, 0.5);
  }

  private spawn(width: number, height: number, sprite: Sprite) {
    sprite.x = Math.floor(Math.random() * width);
    sprite.y = Math.floor(Math.random() * height);
  }

  private move(sprite: Sprite) {
    sprite.x += sprite.velocityX;
    sprite.y += sprite.velocityY;
  }

  private isAABB(sprite1: Sprite, sprite2: Sprite): boolean {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }

  private boundariesGuard(sprite: Sprite) {
    if (sprite.x < 0 || sprite.x > screen.width) {
      sprite.velocityX *= -1; // Reverse direction in x
    }
    if (sprite.y < 0 || sprite.y > screen.height) {
      sprite.velocityY *= -1; // Reverse direction in y
    }
  }

  private reverseVelocity(sprite1: Sprite, sprite2: Sprite) {
    const tempVelocityX = sprite1.velocityX;
    const tempVelocityY = sprite1.velocityY;
    sprite1.velocityX = sprite2.velocityX;
    sprite1.velocityY = sprite2.velocityY;
    sprite2.velocityX = tempVelocityX;
    sprite2.velocityY = tempVelocityY;
  }

  private onTick(_: Ticker) {
    for (let i = 0; i < this.sprites.length; i++) {
      const sprite = this.sprites[i];
      this.move(sprite);
      this.boundariesGuard(sprite);
    }

    for (let i = 0; i < this.sprites.length - 1; i++) {
      for (let j = i + 1; j < this.sprites.length; j++) {
        if (this.isAABB(this.sprites[i], this.sprites[j])) {
          this.reverseVelocity(this.sprites[i], this.sprites[j]);
        }
      }
    }
  }
}
