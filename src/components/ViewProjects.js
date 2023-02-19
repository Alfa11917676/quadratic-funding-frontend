import React, { useState, useEffect } from "react";
import Projects from "./Projects";
import { ethers } from "ethers";
import "../styles/ViewProject.css";
const ViewProjects = (props) => {
  const { address, contract, count } = props;
  const [projects, setProjects] = useState();
  const [endTime, setEndTime] = useState();
  const [time, setTime] = useState();
  const [totalPool, setTotalPool] = useState(0);
  const [eventOver, setOver] = useState(false);

  let timerId;
  useEffect(() => {
    let projectList = [];

    for (let i = 0; i < count; i++) {
      projectList.push(
        <Projects
          className="project--card"
          contract={contract}
          address={address}
          id={i}
          over={eventOver}
        />
      );
    }
    async function setEnd() {
      const end = await contract?.EXPIRY();
      console.log(end);
      setEndTime(end);
    }

    async function fetchTotalPool() {
      const total = await contract?.POOL();
      setTotalPool(total);
    }

    setProjects(projectList);
    setEnd();
    fetchTotalPool();
  }, [contract]);

  useEffect(() => {
    timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, [endTime]);

  function refreshClock() {
    const diff = endTime - Math.round(Date.now() / 1000);
    if (diff < 0) {
      setTime("Event over!");
      clearInterval(timerId);
      setOver(true);
      console.log(eventOver);
    } else {
      const hour = Math.floor(diff / 3600);
      const mins = Math.floor((diff / 3600 - hour) * 60);
      const secs = Math.round(((diff / 3600 - hour) * 60 - mins) * 60);
      let clock;
      if (secs < 10) {
        clock = `Time Remaining : ${hour}:${mins}:0${secs}`;
      } else {
        clock = `Time Remaining : ${hour}:${mins}:${secs}`;
      }
      setTime(clock);
    }
  }

  // https://ipfs.io/ipfs/bafyreiafxffoam5resexhlj3s7bbajupmtt2oxqimgyy2ub7pui45k7jlq/metadata.json
  if (contract) {
    return (
      <div className="view--container">
        {endTime && (
          <div className="timer--banner">
            <h1>Demo Event</h1>
            {totalPool && (
              <h2>{`Pool: ${ethers.utils.formatEther(totalPool)} BIT`}</h2>
            )}
            <h2>{time}</h2>
          </div>
        )}
        {projects}
      </div>
    );
  } else {
    return (
      <div className="view--container">
        <h1>Please connect wallet to continue</h1>
      </div>
    );
  }
};

export default ViewProjects;
