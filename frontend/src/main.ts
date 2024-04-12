import { World } from "./world.ts";
import { onBuy, onRevoke } from "./handlers.ts";

document.querySelector("#buy")!.addEventListener("click", onBuy);
document.querySelector("#revoke")!.addEventListener("click", onRevoke);

(async () => {
  await new World(100, "#1099bb", [
    "vanila.png",
    "black.png",
    "chili.png",
    "double.png",
  ]).Run();
})();
