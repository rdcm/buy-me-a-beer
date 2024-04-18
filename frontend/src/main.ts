import { World } from "./world.ts";
import { onBuy } from "./handlers.ts";

document.querySelector("#buy")!.addEventListener("click", onBuy);

(async () => {
  await new World(30, "#1099bb", [{ path: "beer.png", scale: 0.07 }]).Run();
})();
