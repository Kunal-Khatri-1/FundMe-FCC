// test to run right before deploying this to a main net
// last step
// making sure everything is working approximately as expected

const { assert } = require("chai")
const { ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

// using ternary operator => ? :
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          //   const sendValue = ethers.utils.parseEther("0.1")
          const sendValue = ethers.utils.parseUnits("1.0", 17)
          beforeEach(async function () {
              deployer = await getNamedAccounts().deployer
              // not deploying, not doing any fixtures
              // staging test we are assuming that its already deployed here
              // don't need a mock => on stagining assuming we are on testnet
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              // const transactionResponse = await fundMe.withdraw()
              // const transactionReceipt = await transactionResponse.wait(1)
              const transactionResponse = await fundMe.withdraw()
              transactionResponse.wait(1)
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
