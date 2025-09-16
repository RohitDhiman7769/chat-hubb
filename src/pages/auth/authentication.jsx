
// import { useState, useEffect } from "react";
// import "./authentication.css";
// import { useLocation } from "react-router-dom";
// // import Login from "../../components/loginComp";
// import Login from "../../components/login/loginComp";
// import SignUp from "../../components/sign_up/sign-up";
// import ForgetPassword from "../../components/forgetPassowrd";
// import { useNavigate } from "react-router-dom";
// function Authentication() {
//     const [showComp, setShowComp] = useState(1);
//     const navigate = useNavigate();
//     const location = useLocation();

//     /**
//      * set state one for first time
//      */
//     useEffect(() => {
//         console.log(location.pathname)
//         location.pathname == 'forget-password' ? setShowComp(3) : location.pathname == '/sign-up' ? setShowComp(2) : setShowComp(1)
//         console.log(showComp)
//         // location.pathname == '/log-in' || location.pathname == '/' ? setShowComp(1) : location.pathname == '/sign-up' ? setShowComp(2) : setShowComp(3)
//     }, []);


//     const handleNavbar = (param, routePath) => {
//         setShowComp(param)
//         navigate(routePath);
//     };

//     console.log({showComp, location: location.pathname} )

//     return (
//         <>
//             <div className="container">
//                 <div className="main">
//                     {/* {showComp} */}
//                     <div className="auth-nav">
//                         <div
//                             style={{ width: "165px" }}
//                             className={` navBtn ${showComp === 1 ? "bg-white text-darkBlue" : "bg-darkBlue text-white"}`}
//                             onClick={() => handleNavbar(1, "/log-in")}  // Redirect on div click
//                         >
//                             Login
//                         </div>
//                         <div
//                             style={{ width: "167px" }}
//                             className={`navBtn ${showComp === 2 ? "bg-white text-darkBlue" : "bg-darkBlue text-white"}`}
//                             onClick={() => handleNavbar(2, "/sign-up")}  // Redirect on div click
//                         >
//                             Sign-up
//                         </div>
//                         <div
//                             style={{ width: "167px" }}
//                             className={` navBtn ${showComp === 3 ? "bg-white text-darkBlue" : "bg-darkBlue text-white"}`}
//                             onClick={() => handleNavbar(3, "/forget-password")}  // Redirect on div click
//                         >
//                             Forget Password
//                         </div>
//                     </div>
//                     <div className="auth-main">
//                         {showComp == 1 &&
//                             <>
//                                 <Login />
//                             </>
//                         }
//                         {showComp == 2 &&
//                             <>
//                                 <SignUp updateCompValue={setShowComp} />
//                             </>
//                         }
//                         {showComp == 3 &&
//                             <>
//                                 <ForgetPassword />
//                             </>
//                         }
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default Authentication;


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
  // Default to Login if path doesn't match
  const currentTab = activeTab === -1 ? 0 : activeTab;

  // Redirect to /log-in if path is not recognized
  useEffect(() => {
    if (activeTab === -1) {
      navigate("/log-in", { replace: true });
    }
    // eslint-disable-next-line
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
