import React, { useState } from "react";
import "../styles/Body.css";
import Projects from "./Projects";
import { Route, Routes } from "react-router-dom";
import ViewProjects from "./ViewProjects";
import SubmitProject from "./SubmitProject";
const Body = (props) => {
  const { provider, signer, address, contract } = props;
  const [count, setCount] = useState(0);

  contract?.getTotalProjects().then((c) => {
    setCount(parseInt(c));
  });
  console.log(contract);
  return (
    <div className="body--container">
      <Routes>
        <Route
          path="/"
          element={
            <ViewProjects address={address} contract={contract} count={count} />
          }
        />
        <Route
          path="/submit"
          element={<SubmitProject contract={contract} signer={signer} />}
        />
      </Routes>
    </div>
  );
};

export default Body;
