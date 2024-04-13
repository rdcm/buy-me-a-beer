import { World } from "./world.ts";
import { onBuy } from "./handlers.ts";

document.querySelector("#buy")!.addEventListener("click", onBuy);

(async () => {
  await new World(100, "#1099bb", [
    "vanila.png",
    "black.png",
    "chili.png",
    "double.png",
  ]).Run();
})();
