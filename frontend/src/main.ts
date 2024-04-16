import { World } from "./world.ts";
import { onBuy } from "./handlers.ts";

document.querySelector("#buy")!.addEventListener("click", onBuy);

(async () => {
  await new World(30, "#1099bb", ["beer.png"]).Run();
})();
