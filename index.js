import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { abi,contractAddress  } from "./constant.js";


const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw


async function connect(){
    if(typeof window.ethereum !== "undefined"){
       await window.ethereum.request({method:"eth_requestAccounts"})//connecting to metamask
       connectButton.innerHTML = "Connected!"
    }
    else{
       connectButton.innerHTML = "Please install metamask!"
    }
  }


  async function fund(){
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`);
    if(typeof window.ethereum !== "undefined"){
        //provider /connection to blockchain
        //signer/wallet/someone with some gas
        //contract that we are interacting
        // abi and address
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,signer)
        try{
           const transactionResponse = await contract.fund({
               value: ethers.parseEther(ethAmount) ,
            }
          )
          await listenForTransactionMine(transactionResponse, provider)
        }
        catch(error){
          console.log(error);
        }
    }
  }


  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum)
      try {
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.formatEther(balance))
      } catch (error) {
        console.log(error)
      }
    } else {
      balanceButton.innerHTML = "Please install MetaMask"
    }
  }


  async function withdraw() {
    console.log(`Withdrawing...`)
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum)
      //await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const transactionResponse = await contract.withdraw()
        await listenForTransactionMine(transactionResponse, provider)
        // await transactionResponse.wait(1)
      } catch (error) {
        console.log(error)
      }
    } else {
      withdrawButton.innerHTML = "Please install MetaMask"
    }
  }








  function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations. `
                )
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
 }