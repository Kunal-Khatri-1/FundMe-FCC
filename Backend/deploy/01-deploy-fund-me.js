// imports
// main
// calling main

// if we spin up a node then we automatically get our contracts deployed in it

const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

console.log(networkConfig)

// exporting the deployFunc as the default function for hardhat deploy to look for
// function deployFunc(hre) {
//     console.log("hi")
// }

// module.exports.default = deployFunc

// module.exports.default = async (hre) => {
//     const {getNamedAccounts, deployments} = hre
// }

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    // deployer is the account in the config files
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // using different addresses based on what chinId is
    let ethUSDPricefeedAddress
    if (developmentChains.includes(network.name)) {
        // this gives the address
        // const ethUSDAggregator = await deployments.get("MockV3Aggregator")
        const ethUSDAggregator = await ethers.getContract("MockV3Aggregator")
        console.log("ethUSDAggregator: ", ethUSDAggregator)
        ethUSDPricefeedAddress = ethUSDAggregator.address
    } else {
        ethUSDPricefeedAddress = networkConfig[chainId]["ethUSDPricefeed"]
    }

    log("----------------------------------------------------------", chainId)

    // Mock contracts ==> if the contract does not exist we deploy a minimal version for our local testing

    // what happens if we want change the chains
    // when going for localhost or hardhat network we want to use a mock

    console.log(
        "---------------------------------------------------",
        ethUSDPricefeedAddress
    )
    const args = [ethUSDPricefeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUSDPricefeedAddress], // put priceFeed address
        log: true, // custom logging i.e. we don't have to do clg
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(
            network.name && process.env.ETHERSCAN_API_KEY
        )
    ) {
        await verify(fundMe.address, args)
    }
}

module.exports.tags = ["all", "fundMe"]
