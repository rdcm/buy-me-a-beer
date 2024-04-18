import { Assets, Sprite, Application, Ticker } from "pixi.js";
import { randomNumber, randomNumberInRange } from "./utils";

declare module "pixi.js" {
  interface Sprite {
    direction: number;
    velocityX: number;
    velocityY: number;
  }
}

interface SpriteParams {
  path: string;
  scale: number;
}

export class World {
  private readonly sprites: Sprite[] = [];
  private readonly paths: SpriteParams[];
  private readonly count: number;
  private readonly background: string;
  private readonly app: Application = new Application();

  constructor(count: number, background: string, paths: SpriteParams[]) {
    this.count = count;
    this.background = background;
    this.paths = paths;
  }

  public async Run() {
    await this.app.init({
      background: this.background,
      width: screen.width,
      height: window.innerHeight,
    });
    document.body.appendChild(this.app.canvas);
    await this.fillGrid();
    this.app.ticker.add((timer) => this.onTick(timer));
  }

  private async fillGrid() {
    for (let index = 0; index < this.count; index++) {
      const index = randomNumber(100_000_000) % this.paths.length;
      const sprite = await this.loadSprite(this.paths[index].path);
      this.setup(sprite, this.paths[index].scale);
      this.spawn(sprite);
      this.sprites.push(sprite);
    }
  }

  private async loadSprite(path: string): Promise<Sprite> {
    await Assets.load(path);
    const sprite = Sprite.from(path);
    this.app.stage.addChild(sprite);
    return sprite;
  }

  private setup(sprite: Sprite, scale: number) {
    sprite.scale.set(scale);
    sprite.anchor.set(0.5, 0.5);
    sprite.direction = randomNumberInRange(-1, 1, 0);
    sprite.velocityX = randomNumberInRange(-1, 1, 0);
    sprite.velocityY = randomNumberInRange(-1, 1, 0);
  }

  private spawn(sprite: Sprite) {
    const bounds = sprite.getBounds();
    do {
      sprite.x = randomNumberInRange(
        bounds.maxX,
        this.app.screen.width - bounds.maxX,
      );
      sprite.y = randomNumberInRange(
        bounds.maxY,
        this.app.screen.height - bounds.maxY,
      );
    } while (this.hasIntersection(sprite));
  }

  private hasIntersection(sprite: Sprite): boolean {
    for (let i = 0; i < this.sprites.length; i++) {
      if (this.isAABB(sprite, this.sprites[i])) {
        return true;
      }
    }

    return false;
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
    const bounds = sprite.getBounds();
    if (bounds.x < 0 || bounds.maxX > this.app.screen.width) {
      sprite.velocityX *= -1; // Reverse direction in x
    }

    if (bounds.y < 0 || bounds.maxY > this.app.screen.height) {
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
