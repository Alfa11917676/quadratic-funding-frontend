import React from "react";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";
const Navbar = (props) => {
  const { connectWallet, address } = props;
  return (
    <nav className="navbar-container">
      <ul className="nav-items">
        <li>
          <h1>Quadra</h1>
        </li>
        <li>
          <Link to="/" className="link">
            View Projects
          </Link>
        </li>
        <li>
          <Link to="/submit" className="link">
            Submit Project
          </Link>
        </li>
        {!address && (
          <button className="wallet-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {address && <button className="wallet-button">{address}</button>}
      </ul>
    </nav>
  );
};

export default Navbar;
