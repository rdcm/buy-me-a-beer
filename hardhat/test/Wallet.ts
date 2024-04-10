import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Wallet", function () {
  async function deployWaletFixture() {
    const [owner, other1, other2] = await hre.ethers.getSigners();

    const Wallet = await hre.ethers.getContractFactory("Wallet");
    const wallet = await Wallet.deploy();

    return { wallet, owner, other1, other2 };
  }

  describe("Defaults", function () {
    it("Should be deployed", async function () {
      const { wallet } = await loadFixture(deployWaletFixture);
  
      const walletAddress = await wallet.getAddress();
  
      expect(walletAddress).to.be.properAddress;
    });
  
    it("Should set the right owner", async function () {
      const { wallet, owner } = await loadFixture(deployWaletFixture);
  
      const walletOwner = await wallet.owner();
  
      expect(walletOwner).to.equal(owner.address);
    });
  
    it("Should have 0 ether by default", async function () {
      const { wallet } = await loadFixture(deployWaletFixture);
  
      const balance = await wallet.getBalance();
  
      expect(balance).to.eq(0);
    });
  });

  describe("Happy paths", function () {
    it("Should return increased balance after top up", async function () {
      const amount = hre.ethers.parseEther("321.0");
      const { wallet, owner, other1 } = await loadFixture(deployWaletFixture);
  
      await wallet.connect(other1).topUp({value: amount});
      const balance = await wallet.getBalance();
  
      expect(balance).to.eq(amount);
    });

    it("Should receive ether using receive function", async function () {
      const amount = hre.ethers.parseEther("321.0");
      const { wallet, owner, other1 } = await loadFixture(deployWaletFixture);
  
      await other1.sendTransaction({ to: await wallet.getAddress(), value: amount });
  
      const balance = await wallet.getBalance();
      expect(balance).to.eq(amount);
    })

    it("Should have 0 ether after success withdraw", async function () {
      const amount = hre.ethers.parseEther("321.0");
      const { wallet, owner, other1, other2 } = await loadFixture(deployWaletFixture);
      const targetInitBalance = await hre.ethers.provider.getBalance(other2);
  
      await wallet.connect(other1).topUp({value: amount});
      await wallet.withdraw(other2);
  
      expect(await wallet.getBalance()).to.eq(0);
      expect(await hre.ethers.provider.getBalance(other2)).to.eq(amount + targetInitBalance);
    });    
  });

  describe("Negative cases", function () {
    it("Should revert with the right error if called from another account", async function () {
      const { wallet, owner, other1, other2 } = await loadFixture(deployWaletFixture);
  
      await expect(wallet.connect(other1).withdraw(other2)).to.be.revertedWith("fuck off");
    });
  
  
    it("Should not allow pass 0 address for withdraw", async function () {
      const { wallet, owner } = await loadFixture(deployWaletFixture);
  
      await expect(wallet.withdraw(hre.ethers.ZeroAddress)).to.be.revertedWith("fuck off again");
    });
  });

    describe("Events", function () {
      it("Should emit an event on top up", async function () {
        const amount = hre.ethers.parseEther("321.0");
        const { wallet, owner, other1 } = await loadFixture(deployWaletFixture);

        await expect(wallet.connect(other1).topUp({ value: amount }))
          .to.emit(wallet, "Received")
          .withArgs(amount, anyValue);
      });

      it("Should emit an event on withdrawal", async function () {
        const amount = hre.ethers.parseEther("321.0");
        const { wallet, owner, other1 } = await loadFixture(deployWaletFixture);

        wallet.connect(other1).topUp({ value: amount });

        await expect(wallet.withdraw(other1))
          .to.emit(wallet, "Withdrawal")
          .withArgs(amount, anyValue);
      });

      it("Should emit an event on receive", async function () {
        const amount = hre.ethers.parseEther("321.0");
        const { wallet, owner, other1 } = await loadFixture(deployWaletFixture);

        await expect(other1.sendTransaction({ to: await wallet.getAddress(), value: amount }))
          .to.emit(wallet, "Received")
          .withArgs(amount, anyValue);
      });
    });
});
