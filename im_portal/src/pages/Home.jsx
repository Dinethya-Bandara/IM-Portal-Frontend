import "./Home.css";
import Navbar from "../components/Navbar";
import bgImage from "../assets/bg.jpg";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  return (
    <div className="flex w-screen flex-col h-screen px scrollbar-hide overflow-scroll">
      <div className="fixed w-full z-50">
        <Navbar />
      </div>

      <div className="w-full h-full bg-gray-400 px-16 py-8 bg-cover bg-center relative mt-22" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-[#115555]/80 z-0"></div>

        <div className="flex relative z-10 flex-col items-center text-white mt-8 overflow-scroll overflow-x-hidden scrollbar-hide ">
          <h1 className="font-semibold">WELCOME TO IM PORTAL</h1>
          <p>
            Department of Industrial Management, Faculty of Science,
            University of Kelaniya
          </p>
          <div className="home-buttons mt-12 ">
            <button onClick={() => navigate("/login")}>Login to Portal</button>
            {isAdmin && (
              <button onClick={() => navigate("/create-account")}>Create Account</button>
            )}
          </div>
          <div className="flex flex-col items-center my-10">
            <h3 id="about-us" className="text-xl font-semibold my-4">ABOUT US</h3>
            <div className="bg-white/10 p-4 rounded-md">
              <p>
                The Department of Industrial Management was established with the aim of providing education, conducting
                research, and offering training in the field of Industrial Management to mould science students into skilled
                professionals in both Management and Information Technology disciplines. The department has gained a reputation
                for its pivotal role in shaping undergraduates who exhibit the capacity to question and redefine the established paradigms
                within both academic and industrial domains.
              </p>
            </div>
          </div>

          <div className="flex gap-8 mb-12">
            <div className="flex flex-col items-center flex-1">
              <h3 className="text-xl font-semibold my-4">OUR VISION</h3>
              <div className="bg-white/10 p-4 rounded-md w-full flex justify-center h-full items-center">
                <p>
                  A Thought Leader in Digital Transformation.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <h3 className="text-xl font-semibold my-4">OUR MISSION</h3>
              <div className="bg-white/10 p-4 rounded-md">
                <p>
                  In the areas of Management and Information Technology, we strive to excel
                  in providing higher education to selected students, training industry
                  clients, consultancy and research by collaborating with all stakeholders
                  in the design and delivery of need oriented programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-screen">
        <Footer />
      </div>

    </div>
  );
}