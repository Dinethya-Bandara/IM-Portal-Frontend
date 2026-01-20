import "./Footer.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const goToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col footer-brand">
          <div className="brand-title">IM PORTAL</div>
          <div className="brand-sub">
            Department of Industrial Management,
            <br />
            University of Kelaniya
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-title">Quick Links</div>
          <button className="footer-link" onClick={() => goToSection("homeTop")}>
            Home
          </button>
          <button className="footer-link" onClick={() => goToSection("about")}>
            About
          </button>
          <button className="footer-link" onClick={() => goToSection("contact")}>
            Contact
          </button>
        </div>

        <div className="footer-col">
          <div className="footer-title">Portal Access</div>
          <Link className="footer-link" to="/student-login">
            Student Login
          </Link>
          <Link className="footer-link" to="/lecturer-login">
            Lecturer Login
          </Link>
          <Link className="footer-link" to="/staff-login">
            Staff Login
          </Link>
          <Link className="footer-link" to="/register">
            Register
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Department of Industrial Management, University
        of Kelaniya. All rights reserved.
      </div>
    </footer>
  );
}
