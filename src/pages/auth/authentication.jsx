import { useEffect } from "react";
import "./authentication.css";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "../../components/login/loginComp";
import SignUp from "../../components/sign_up/sign-up";
import ForgetPassword from "../../components/forgetPassowrd";

const TABS = [
  { label: "Login", path: "/log-in" },
  { label: "Sign-up", path: "/sign-up" },
  { label: "Forget Password", path: "/forget-password" },
];

function Authentication() {
  const navigate = useNavigate();
  const location = useLocation();

  // Find the active tab index based on the current path
  const activeTab = TABS.findIndex(tab => tab.path === location.pathname);
  const currentTab = activeTab === -1 ? 0 : activeTab;

  useEffect(() => {
    if (activeTab === -1) {
      navigate("/log-in", { replace: true });
    }
  }, []);

  const handleNavbar = (routePath) => {
    navigate(routePath);
  };

  return (
    <div className="container">
      <div className="main">
        <div className="auth-nav">
          {TABS.map((tab, idx) => (
            <div
              key={tab.path}
              style={{ width: "165px" }}
              className={`navBtn ${currentTab === idx ? "bg-white text-darkBlue" : "bg-darkBlue text-white"}`}
              onClick={() => handleNavbar(tab.path)}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <div className="auth-main">
          {currentTab === 0 && <Login />}
          {currentTab === 1 && <SignUp updateCompValue={() => {
            navigate("/log-in", { replace: true });
          }} />}
          {currentTab === 2 && <ForgetPassword />}
        </div>
      </div>
    </div>
  );
}

export default Authentication;
