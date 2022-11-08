// in nodejs
// require() => doesn't work in the frontend

// in front-end javascript can't use require
// later using import

// we don't want to install ethers with a node modules package
// instead of doing a node module, we'll copy the ethers library to our own directories and serve it ourselves
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
const balance = document.getElementById("balance")
// type in script tag => changing the type to module makes us write onclick here
// see the difference between writig onclick in html and writing it here (html one did'nt work)
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)

async function connect() {
    if (typeof window.ethereum != undefined) {
        // connect to metaMask
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            connectButton.innerHTML = "Connected!"
        } catch (error) {
            console.log("ERROR: ", error)
        }
    }
}

async function getBalance() {
    if (typeof window.ethereum != undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balanceValue = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balanceValue))
        balance.innerText = `${balanceValue} wei`
    }
}

// fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum != undefined) {
        // provider/connection to the blockchain
        // signer/wallet/someone with some gas
        // contract that we are interacting with
        // ABI and address
        // providers using ethers
        // Web3Provider is an object in ethers that allows us to wrap around metamask
        // Web3Provider is similar to JsonRPCProvider we used earlier (the Alchemy url)
        // Web3Provider inherits JsonRpcProvider
        // this codes looks at our metamask and finds the HTTP endpoint that is going to used as provider
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // console.log(provider)
        // since provider is connected to metamask we can get the signer/wallet
        // this is going to return whichever wallet is connected to the provider(provider => metamask)
        const signer = provider.getSigner()
        // this will return account connected
        // console.log(signer)

        // const contract = "" // ?
        // to get abi => artifacts/contracts/FundMe.sol/FundMe.json => copy the abi => paste in constants.js => import here
        // to get local contract address =>
        // 1. yarn hardhat node => get the address
        // 2. open another terminal here => navigate to the hardhat-fund-me-fcc folder => yarn hardhat node => get the address
        // ethers contract object that is connected to signer with contract address and
        try {
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // wait for this transaction to finish
            // await makes us stop for promise to resolve or reject only then we move forward
            // if we didn't use promise then using await does not make any sense
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done")
            alert(`Successfully funded ${ethAmount} to the contract`)
        } catch (error) {
            console.log(error)
            alert(`Failed to fund`)
        }

        // importing one of the Hardhat-Localhost account to metamask
        // 1. take the private key and import the account
        // 2. using JSON => encrypted JSON key + password
    }
}

// we don't want to be it an async function
function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    // return new Promise()
    // create a listner for the blockchain

    // listen for the transaction to finish
    // provider.once or contract.once both work
    // provider.once() => one time only when event occours
    // provider.on() => any time when the event occours
    // provider.once(eventName, listner)
    // when this event transactionResponse.hash gets over it gives the listner function the transactionReceipt

    // await listenForTransactionMine will kick off the listener
    // but it doesn't wait for the listner
    // this function will finsish before provider.once is finished
    // provider.once(transactionResponse.hash, (transactionReceipt) => {
    //     console.log(
    //         `Completed with ${transactionReceipt.confirmations} confirmations`
    //     )
    // })

    // await for the listner to finish listening
    return new Promise((resolve) => {
        // here code will run synchronously therefore promise will not be resolved until the event occours
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

// withdraw function
async function withdraw() {
    if (typeof window.ethereum != undefined) {
        console.log("withdrawing")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            alert(`Successfully withdrawn funds`)
        } catch (error) {
            console.log("ERROR: ", error)
            alert(`Failed to withdraw funds`)
        }
    }
}
