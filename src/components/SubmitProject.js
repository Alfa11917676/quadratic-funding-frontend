import React, { useState } from "react";
import "../styles/SubmitProject.css";
import { NFTStorage } from "nft.storage";
import { ethers } from "ethers";
const SubmitProject = (props) => {
  const { contract, signer } = props;
  const [file, setFile] = useState();
  const [propjectName, setName] = useState("");
  const [projectDesc, setDesc] = useState("");
  const [status, setStatus] = useState("Submit");
  const uploadImageToIPFS = async () => {
    // create a new NFTStorage client using our API key
    const nftstorage = new NFTStorage({
      token: process.env.REACT_APP_STORAGE_KEY,
    });

    // call client.store, passing in the image & metadata
    return nftstorage.store({
      image: file,
      name: propjectName,
      description: projectDesc,
    });
  };
  const handleImageUpload = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleTextChange = (event) => {
    setDesc(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Uploading to IPFS");
    let cid = await uploadImageToIPFS(file);
    setStatus("Wating tx");
    const tx = await contract.createProject(cid.url.toString());
    console.log(tx);
    alert(`Transaction submitted with hash: ${tx.hash}`);
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      alert("Transaction successful");
    } else {
      alert("Transaction failed");
    }
    setStatus("Transaction successful");
    console.log("Submit");
  };

  console.log("Submit page");
  return (
    <div>
      <form className="form--container">
        <input
          placeholder="Project Name"
          onChange={(e) => handleNameChange(e)}
        />
        <textarea
          placeholder="Project Description"
          onChange={(e) => handleTextChange(e)}
        />
        <input
          type="file"
          accept="image/png, image/jpg, image/gif, image/jpeg"
          onChange={(e) => handleImageUpload(e)}
        />
        <button className="submit-button" onClick={handleSubmit}>
          {status}
        </button>
        {file && <img src={URL.createObjectURL(file)} />}
      </form>
    </div>
  );
};

export default SubmitProject;
