const networkConfig = {
    // chainId 5 then
    5: {
        name: "goerli",
        ethUSDPricefeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        chainId: 5,
    },
    // EThereum mainnet
    1: {
        name: "mainnet",
        ethUSDPricefeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        chainId: 1,
    },
    // 31337
    31337: {
        name: "localhost",
        chainId: 31337,
    },
}

const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000

module.exports = { networkConfig, developmentChains, DECIMALS, INITIAL_ANSWER }
