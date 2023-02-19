import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
const Projects = (props) => {
  const { contract, address, id, over } = props;
  const [metadata, setMetadata] = useState();
  const [image, setImage] = useState();
  const [donationAmount, setAmount] = useState(0);
  const [creator, setCreator] = useState();
  const [matching, setMatching] = useState();
  console.log("Project rendering");
  console.log(address, id, over, creator);
  useEffect(() => {
    async function fetchMetadata() {
      let meta = await contract?.projectMetadata(id);
      let url = `https://ipfs.io/ipfs/${meta.split("//")[1]}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setMetadata(data);
          setImage(`https://ipfs.io/ipfs/${data.image.split("//")[1]}`);
        });
    }

    async function fetchCreator() {
      let creator = await contract?.projectCreator(id);
      setCreator(creator);
    }

    async function fetchMatching() {
      let directDonation = await contract?.projectList(id);
      let matching = await contract?.checkMatching(id);
      console.log(directDonation);
      console.log(matching);
      setMatching(matching.add(directDonation));
    }

    fetchMetadata();
    fetchCreator();
    fetchMatching();
  }, [contract]);

  const updateDonation = (e) => {
    setAmount(e.target.value);
  };

  const collect = async () => {
    await contract.retrieveMatching(id);
  };

  const donate = async () => {
    await contract.donate(id, {
      value: ethers.utils.parseEther(donationAmount.toString()),
    });
  };
  return (
    <div className="project--card">
      {metadata && <h1 className="margin-reset">{metadata.name}</h1>}
      {creator && (
        <div className="creator-container project--by">{`By:${creator}`}</div>
      )}
      {metadata && <p>{metadata.description}</p>}
      {image && <img src={image} className="project-img" />}
      {!over &&
        address &&
        creator &&
        address.toLowerCase() !== creator.toLowerCase() && (
          <>
            <div className="donate--container">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                step="0.001"
                min="0"
                name="amount"
                value={donationAmount}
                onChange={updateDonation}
              />
            </div>
            <button className="donate--button" onClick={donate}>
              Donate
            </button>
          </>
        )}
      {over && <div className="donate--container">Event over!</div>}
      {address &&
        creator &&
        address.toLowerCase() === creator.toLowerCase() &&
        !over && <div className="self--container">Can't donate to self</div>}
      {address &&
        creator &&
        address.toLowerCase() === creator.toLowerCase() &&
        over && (
          <button className="donate--button" onClick={collect}>
            Collect
          </button>
        )}
      {matching !== undefined && (
        <p>{`Match amount: ${ethers.utils.formatEther(matching)}`}</p>
      )}
    </div>
  );
};

export default Projects;
