import { ETHERIUM_PROVIDER, REJECTED_BY_USER, WALLET_ADDRESS } from "./consts";
import { Contract, BrowserProvider, parseEther } from "ethers";
import artifact from "../contracts/Wallet.json";

export class Wallet {
  private static contract: Contract | null = null;

  public static async TopUp(amount: string) {
    const wallet = await this.getInstance();
    const val = parseEther(amount);
    await wallet.topUp({ value: val }).catch((error) => {
      if (error?.info?.error?.code === REJECTED_BY_USER) {
        return;
      }

      console.error(error);
    });
  }

  public static async GetBalance(): Promise<number> {
    const wallet = await this.getInstance();

    return await wallet.getBalance();
  }

  private static async getInstance(): Promise<Contract> {
    if (this.contract != null) {
      return this.contract;
    }

    const provider = new BrowserProvider(ETHERIUM_PROVIDER);
    const caller = await provider.getSigner(0);

    return new Contract(WALLET_ADDRESS, artifact.abi, caller);
  }
}