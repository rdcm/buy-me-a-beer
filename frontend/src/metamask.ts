import { ETHERIUM_PROVIDER, REJECTED_BY_USER } from "./consts";

export interface State {
  currentAccount: string | null;
  accounts: string[];
}

export class MetaMask {
  private static readonly state: State = {
    currentAccount: null,
    accounts: [],
  };

  public static async RequestPermissions() {
    const accounts: string[] = await ETHERIUM_PROVIDER.request({
      method: "eth_requestAccounts",
    }).catch((err: { code: number }) => {
      if (err.code === REJECTED_BY_USER) {
      } else {
        console.error(err);
      }
    });

    this.onAccountsChanged(accounts);
  }

  public static Exists(): boolean {
    return typeof ETHERIUM_PROVIDER !== "undefined";
  }

  public static async GetAccounts() {
    ETHERIUM_PROVIDER.request({ method: "eth_accounts" })
      .then(async (accounts: string[]) => {
        await this.onAccountsChanged(accounts);
      })
      .catch((err: any) => {
        // Some unexpected error.
        // For backwards compatibility reasons, if no accounts are available, eth_accounts returns
        // an empty array.
        console.error(err);
      });
  }

  public static GetState(): State {
    return this.state;
  }

  public static async RevokePermissions() {
    await ETHERIUM_PROVIDER.request({
      method: "wallet_revokePermissions",
      params: [
        {
          eth_accounts: this.state.accounts,
        },
      ],
    }).then(() => this.resetState());
  }

  private static resetState() {
    this.state.currentAccount = null;
    this.state.accounts = [];
  }

  private static async onAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      return;
    } else if (accounts[0] !== this.state.currentAccount) {
      this.state.currentAccount = accounts[0];
      this.state.accounts = accounts;
    }
  }
}
