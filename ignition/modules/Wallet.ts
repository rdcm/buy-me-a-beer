import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WalletModule = buildModule("WalletModule", (m) => {
  const wallet = m.contract("Wallet");

  return { wallet };
});

export default WalletModule;
