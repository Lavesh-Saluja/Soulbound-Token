import './uid.css';
import { Contract, providers, utils } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { UID_CONTRACT_ADDRESS,abi,UID_VERIFY_ADDRESS,abi_verify } from "../constants";
import Auth from "../components/Auth"
function Uid() {
  const [walletConnected, setWalletConnected] = useState(false);  
  const [id,setId] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [verify, setVerify] = useState(false);
  const [token, setToken] = useState(false);
  const [address, setAddress] = useState("");
  const web3ModalRef = useRef();


  const whitelistAddress = async () => {
    try{ const signer = await getProviderOrSigner(true);
    const contract = new Contract(UID_CONTRACT_ADDRESS, abi, signer);
    const tx = await contract.addToWhiteList(address);
      await tx.wait();
      window.alert("Address Added to whitelist")
    }
    catch (e) {
      console.error(e)
    }
  }

  const mintToken = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(UID_CONTRACT_ADDRESS, abi, signer);
      const tx = await contract.safeMint("");
      await tx.wait();
    } catch (e) {
      console.error(e);
    }
  }
  const isVerified = ()=>{
    if (localStorage.getItem('login') === null) {
      setVerify(false);
    }
    else {
      setVerify(true);
    }
  }
  const hasToken=async() => {
 try{const signer = await getProviderOrSigner(true);
    const contract = new Contract(UID_CONTRACT_ADDRESS, abi, signer);
    const flag = await contract.hasToken();
    setToken(flag);
   console.log(token, "===Token");
 } catch (e) { console.error(e) }
  }

    const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, wh  ich in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };
const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
  try{  const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Binance");
      throw new Error("Change network to Binance");
    }
  

  if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  } catch (e) {
    console.log('------------------------------------');
    console.log(e);
    console.log('------------------------------------');
    }
};
  
  

  const clearInput = () => {
    var tags = document.getElementsByClassName('clear');
    for(var i=0; i< tags.length; i++){
    tags[i].value = "";
}

  }


  useEffect(() => {
    if (!walletConnected) {
            web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      hasToken();
      isVerified();
      // getRewards();
      // getFixedAPY();

    }
    
  },[walletConnected]);
  
  




  return (
    <div className="container">
      {
        token?<h2>Verified and Soulbound Token Minted</h2>:verify?<button onClick={mintToken}>mint token</button>:<Auth></Auth>
      }
      
       <div class="left-side">
    <div class="details">
         
       
    
        </div>
      
      </div>
      
      <div class="right-side">
        <div>
          <div class="input-bar">
               <label>WhiteList Address </label>
            <input type="text" placeholder="address" onChange={(e) => { setAddress(e.target.value) }} className="clear" />
        <button type="submit" onClick={whitelistAddress} >WhiteList Address</button>
            
      </div>
          
        </div>
  </div>
    </div>
  );
}
export default Uid;
