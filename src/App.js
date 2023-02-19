import { useState, useEffect } from "react";
import abi from "./abi.json";
import "./App.css";
import Navbar from "./components/Navbar";
import Body from "./components/Body";
import { ethers } from "ethers";

function App() {
  const [address, setAddress] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();

  async function requestWallet() {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      setAddress(accounts[0]);

      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.testnet.mantle.xyz"
      );
      const signerProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const signer = await signerProvider.getSigner(0);
      setSigner(signer);
      const contract = new ethers.Contract(
        "0x7C29E91aEf192729D2a5BDa633063244F23900a7",
        abi,
        signer
      );

      setContract(contract);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    requestWallet();
  }, []);

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      requestWallet();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Navbar connectWallet={connectWallet} address={address} />
      <Body
        provider={provider}
        signer={signer}
        address={address}
        contract={contract}
      />
    </div>
  );
}

export default App;
