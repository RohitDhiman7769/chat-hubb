
import { useState, useEffect } from "react";
import "./authentication.css";
import { useLocation } from "react-router-dom";
import Login from "../../components/loginComp";
import SignUp from "../../components/sign-up";
import ForgetPassword from "../../components/forgetPassowrd";
import { useNavigate } from "react-router-dom";
function Authentication() {
    const [showComp, setShowComp] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * set state one for first time
     */
    useEffect(() => {
        console.log( location.pathname)
        location.pathname == '/log-in' || location.pathname == '/' ? setShowComp(1) : location.pathname == '/sign-up' ? setShowComp(2) : setShowComp(3)
    }, []);


    const handleNavbar = (param, routePath) => {
        setShowComp(param)
        navigate(routePath);
    };

    return (
        <>
            <div className="container">
                <div className="main">
                    {/* {showComp} */}
                    <div className="auth-nav">
                        <div
                            style={{ width: "165px" }}
                            className={` navBtn ${showComp === 1 ? "bg-white text-darkBlue" : "bg-darkBlue text-white"}`}
                            onClick={() => handleNavbar(1, "/log-in")}  // Redirect on div click
                        >
                            Login
                        </div>
                        <div
                            style={{ width: "167px" }}
                            className={`navBtn ${showComp === 2 ? "bg-white text-darkBlue" : "bg-darkBlue text-white"}`}
                            onClick={() => handleNavbar(2, "/sign-up")}  // Redirect on div click
                        >
                            Sign-up
                        </div>
                        <div
                            style={{ width: "167px" }}
                            className={` navBtn ${showComp === 3 ? "bg-white text-darkBlue" : "bg-darkBlue text-white"}`}
                            onClick={() => handleNavbar(3, "/forget-password")}  // Redirect on div click
                        >
                            Forget Password
                        </div>
                    </div>
                    <div className="auth-main">
                        {showComp == 1 &&
                            <>
                                <Login />
                            </>
                        }
                        {showComp == 2 &&
                            <>
                                    <SignUp updateCompValue={setShowComp} />
                            </>
                        }
                        {showComp == 3 &&
                            <>
                                <ForgetPassword />
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Authentication;
