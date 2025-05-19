import './uid.css';
import { Contract, providers } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { UID_CONTRACT_ADDRESS, abi } from "../constants";
import Auth from "../components/Auth";
import Navbar from '../components/Navbar';
function Uid() {
  const [id, setId] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Connecting to wallet...");
  const [walletConnected, setWalletConnected] = useState(false);
  const [token, setToken] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const walletAddressRef = useRef();
  const verifyRef = useRef(false);
  const web3ModalRef = useRef();

  const whitelistAddress = async () => {
    if (!address) {
      showNotification("Please enter an address to whitelist", "error");
      return;
    }
    
    try {
      setLoadingMessage("Whitelisting address...");
      setLoading(true);
      
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(UID_CONTRACT_ADDRESS, abi, signer);
      const tx = await contract.addToWhiteList(address);
      await tx.wait();
      
      showNotification("Address successfully whitelisted!", "success");
      setAddress("");
    } catch (e) {
      console.error(e);
      showNotification("Failed to whitelist address", "error");
    } finally {
      setLoading(false);
    }
  }

  const mintToken = async () => {
    try {
      setLoadingMessage("Minting your token...");
      setLoading(true);
      
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(UID_CONTRACT_ADDRESS, abi, signer);
      const tx = await contract.safeMint();
      await tx.wait();
      
      await hasToken();
      showNotification("Soulbound token minted successfully!", "success");
    } catch (e) {
      console.error(e);
      showNotification("Failed to mint token", "error");
    } finally {
      setLoading(false);
    }
  }

  const isVerified = async () => {
    try {
      const res = await fetch(`http://localhost:5000/isVerified/${walletAddressRef.current}`);
      const data = await res.json();
      verifyRef.current = data.verified;
      return data.verified;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  const hasToken = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(UID_CONTRACT_ADDRESS, abi, signer);
      const flag = await contract.hasToken();
      setToken(flag);
      return flag;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  const connectWallet = async () => {
    try {
      setLoadingMessage("Connecting to wallet...");
      setLoading(true);
      
      await getProviderOrSigner();
      setWalletConnected(true);
      
      // Check verification and token status
      await isVerified();
      await hasToken();
      
      showNotification("Wallet connected successfully!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to connect wallet", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = "block";
    
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  };

  const getProviderOrSigner = async (needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      
      const { chainId } = await web3Provider.getNetwork();
      if (chainId !== 97) {
        showNotification("Please switch to Polygon network", "error");
        throw new Error("Change network to Polygon");
      }
    
      const signer = web3Provider.getSigner();
      walletAddressRef.current = await signer.getAddress();
      
      // Check if user is admin
      const contract = new Contract(UID_CONTRACT_ADDRESS, abi, signer);
      const ownerAddress = await contract.owner();
      setIsAdmin(ownerAddress.toLowerCase() === walletAddressRef.current.toLowerCase());
      
      if (needSigner) {
        return signer;
      }
      return web3Provider;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "testnet",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <>
      <Navbar {...{connectWallet,walletConnected, walletAddress: walletAddressRef.current}} />
    <div className="uid-container">

      <div id="notification" className="notification"></div>
      
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>{loadingMessage}</p>
        </div>
      ) : (
        <>
          <div className="header">
            <h1>Soulbound Identity Verification</h1>
            <div className="wallet-info">
              {/* {walletConnected && (
                <div className="address-pill">
                  <div className="address-icon"></div>
                  <span className="address-text">
                    {walletAddressRef.current?.slice(0, 6)}...{walletAddressRef.current?.slice(-4)}
                  </span>
                </div>
              )} */}
              {!walletConnected && (
                <button className="connect-wallet-btn" onClick={connectWallet}>
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          <div className="content-container">
            <div className="verification-section">
              {token ? (
                <div className="success-container">
                  <div className="success-icon">✓</div>
                  <h2>Verification Complete</h2>
                  <p>You have successfully verified your identity and minted your soulbound token!</p>
                </div>
              ) : verifyRef.current ? (
                <div className="mint-container">
                  <h2>Identity Verified</h2>
                  <p>Your identity has been verified. You can now mint your soulbound token.</p>
                  <button className="mint-btn" onClick={mintToken}>
                    Mint Soulbound Token
                  </button>
                </div>
              ) : (
                <Auth value={walletAddressRef} />
              )}
            </div>
            
            {isAdmin && (
              <div className="admin-section">
                <div className="admin-card">
                  <h2>Admin Controls</h2>
                  <p>As the contract owner, you can whitelist addresses.</p>
                  
                  <div className="input-group">
                    <input
                      type="text"
                      value={address}
                      placeholder="Enter address to whitelist"
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <button className="whitelist-btn" onClick={whitelistAddress}>
                      Whitelist Address
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      </div>
    </>
  );
}

export default Uid;