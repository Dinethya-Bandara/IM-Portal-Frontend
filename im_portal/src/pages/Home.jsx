import "./Home.css";
import Navbar from "../components/Navbar";
import bgImage from "../assets/bg.jpg"; 
import Footer from "../components/Footer.jsx";

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <section
        className="home-hero"
        style={{ backgroundImage: `url(${bgImage})` }}  // 👈 apply here
      >
        <div className="home-overlay"></div>

        <div className="home-content">
          <h1>WELCOME TO IM PORTAL</h1>
          <p>
            Department of Industrial Management, Faculty of Science,
            University of Kelaniya
          </p>

          <div className="home-buttons">
            <button>Login to Portal</button>
            <button>Create Account</button>
          </div>

          <h3 className="about-title">ABOUT US</h3>
          <div className="about-card">
          <p>
            The Department of Industrial Management was established with the aim of providing education, conducting 
            research, and offering training in the field of Industrial Management to mould science students into skilled 
            professionals in both Management and Information Technology disciplines. The department has gained a reputation 
            for its pivotal role in shaping undergraduates who exhibit the capacity to question and redefine the established paradigms 
            within both academic and industrial domains.
          </p>
          </div>

          {/* ===== VISION & MISSION STRIP ===== */}
          <div className="home-vm-strip">
            <div className="home-vm-box">
              <h3>OUR VISION</h3>
              <div className="home-vm-content">
                <p>“A Thought Leader in Digital Transformation”</p>
              </div>
            </div>

            <div className="home-vm-box">
              <h3>OUR MISSION</h3>
              <div className="home-vm-content">
                <p>
                  “In the areas of Management and Information Technology, we strive to excel
                  in providing higher education to selected students, training industry
                  clients, consultancy and research by collaborating with all stakeholders
                  in the design and delivery of need oriented programs”
                </p>
              </div>
            </div>
          </div>
          
        </div>
        
      </section>
      
      
    </div>
  );
}
