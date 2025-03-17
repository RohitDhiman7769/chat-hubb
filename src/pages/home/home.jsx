import { useState, useEffect } from "react";
import "./home.css";
// import { Link } from "react-router";
// import { Route, Routes } from 'react-router';
// import Input from "../../components/inputField";
// import Login from "../../components/loginComp";
// import SignUp from "../../components/sign-up";
// import ForgetPassword from "../../components/forgetPassowrd";
import { useNavigate } from "react-router-dom";
import RoomChat from "../../components/room-chat";
function Home() {
    const navigate = useNavigate();
    const [showComp, setShowComp] = useState(1);

    /**
     * set state one for first time
     */
    useEffect(() => {
        setShowComp(1);
        console.log('working')
    }, []);


    const handleNavbar = (param, routePath) => {
        setShowComp(param)
        navigate(routePath);
    };

    return (
        <>
            <div className="container">
                <div className="main">
                <div className="auth-nav">
                        <div
                            style={{ width: "165px" }}
                            className={` navBtn ${showComp === 1 ? "bg-white text-darkBlue" : "bg-darkBlue text-white"}`}
                            onClick={() => handleNavbar(1, "/log-in")}  // Redirect on div click
                        >
                            Rooms
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

                    {/* {showComp} */}

                    <div className="auth-main">
                        <RoomChat />

                        {/* <Routes>
    <Route exact path='/log-in' Component={Login} />
    <Route exact path='/sign-up' Component={SignUp} />
    <Route exact path='/forget-password' Component={ForgetPassword} />
</Routes> */}
                    </div>

                    

                </div>
            </div>
        </>
    );
}

export default Home;
