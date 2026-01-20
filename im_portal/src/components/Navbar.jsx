import logo from "../assets/logo.png";
import "./NavBar.css";
import GradientButton from "../components/GradientButton.jsx";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-left">
        <img src={logo} className="logo" alt="IM Portal Logo" />
        <div className="brand">
          <div className="brand-title">IM PORTAL</div>
          <div className="brand-sub">Department of Industrial Management</div>
        </div>
      </div>

      <nav className="nav-center">
        <button className="nav-link active">Home</button>
        <button className="nav-link nav-about">About</button>

      </nav>

      <div className="nav-right">
        <button className="btn btn-outline">Login</button>
        <button className="btn btn-solid">Sign Up</button>
      </div>
    </header>
  );
}