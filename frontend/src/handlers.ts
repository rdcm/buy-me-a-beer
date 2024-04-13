import { MetaMask } from "./metamask";
import { Wallet } from "./wallet";

export async function onBuy() {
  const exists = MetaMask.Exists();
  if (!exists) {
    alert("Install Metamask");
    return;
  }

  await MetaMask.RequestPermissions();
  await Wallet.TopUp("0.0016");
}

export async function onRevoke() {
  await MetaMask.RevokePermissions();
}
