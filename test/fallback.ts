import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from 'ethers';

function toWei(number: number) {
    return ethers.utils.parseEther(number.toString());
}

function fromWei(number: BigNumber) {
    return Number(ethers.utils.formatEther(number));
}

describe("Fallback", function () {
    async function deployFallback() {
        const [owner, newOnwer] = await ethers.getSigners();
        const Fallback = await ethers.getContractFactory("Fallback");
        const fallback = await Fallback.deploy();

        return { fallback, owner, newOnwer };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { fallback, owner } = await loadFixture(deployFallback);
            expect(await fallback.owner()).to.equal(await owner.getAddress())
        })
    })

    describe("Cliam owner and reduce balance to 0", function () {
        it("Should cliam owner and reduce balance to 0", async function () {
            const { fallback, newOnwer } = await loadFixture(deployFallback);
            await fallback.connect(newOnwer).contribute({ value: toWei(0.0001) })
            await newOnwer.sendTransaction({ to: fallback.address, value: toWei(0.0001) })
            expect(await fallback.owner()).to.equal(await newOnwer.getAddress())
        })
    })
})