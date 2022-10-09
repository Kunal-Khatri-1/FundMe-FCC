const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    // check if the chinId is in the array
    // can use chainId as well
    // network.name includes hardhat
    log("-----------Mocks Started----------")
    if (developmentChains.includes(network.name)) {
        log(`Local network detected! Deploying mocks... ${network.name}`)
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })

        log("Mocks deployed!")
        log("-------------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
