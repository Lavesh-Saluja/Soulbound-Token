import './uid.css';
import { Contract, providers, utils } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { UID_CONTRACT_ADDRESS,abi } from "../constants";
import Auth from "../components/Auth";
import axios from 'axios';
function Uid() {
  const [walletConnected, setWalletConnected] = useState(false);  
  const [id,setId] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [verify, setVerify] = useState(false);
  const [token, setToken] = useState(false);
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [loading,setLoading]=useState(false);
  const walletAddressRef = useRef();
  const verifyRef=useRef();
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
      const tx = await contract.safeMint();
      await tx.wait();
    } catch (e) {
      console.error(e);
    }
  }
  const isVerified = async () => {
  const options = {
  method: 'POST',
  headers: {'content-type': 'application/json', 'x-api-key': 'H2TBrj7G0SzqNv+'},
  body: JSON.stringify({method: 'get'})
};
fetch('https://api.nexaflow.xyz/api/cors/64ca405317ad72c7fc3d88fb', options)
  .then(response => response.json())
  .then(response => {
    console.log(response.data);
    for (let i = 0; i < response.data.length; i++){
      const refId = (response.data[i].attributes['reference-id']);
      const status = response.data[i].attributes['status'];
      
      console.log(refId, status);
      if (refId == walletAddressRef.current) {
        if (status === 'created')
        continue;
        if (status === 'approved') {
          verifyRef.current = true;
          setStatus(status);
        }
        else {
          verifyRef.current=false;
          setStatus(status);
        }
      }
      else {
        setVerify(false);
      }
    }
  })
  .catch(err => console.error(err));
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
      setLoading(false)
  };
const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
  try{  const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Polygon");
      throw new Error("Change network to Polygon");
    }
  
      const signer = web3Provider.getSigner();
    walletAddressRef.current=(await signer.getAddress());
    if (needSigner) {
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
      setLoading(true);
      connectWallet();
      isVerified();
      hasToken();
      // getRewards();
      // getFixedAPY();

    }
    
  },[walletConnected]);
  
  




  return (

    <div className="container">
     
      <div class="left-side">
        {
          loading?"loading":token?<h4>Verified Soulbound Token Minted</h4>:verifyRef.current?<button onClick={mintToken}>mint token</button>:<Auth value={walletAddressRef}></Auth>
        }
      
        <h4><b>Verification Status:</b> {status}</h4>
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
