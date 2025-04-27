import { useState, useEffect } from "react";
import "./home.css";
// import { Link } from "react-router";
import { Route, Routes } from 'react-router';
// import Input from "../../components/inputField";
// import Login from "../../components/loginComp";
// import SignUp from "../../components/sign-up";
// import ForgetPassword from "../../components/forgetPassowrd";
import { useNavigate } from "react-router-dom";
import RoomChat from "../../components/room-chat";
import Wall from "../../components/wall";
import WorldChat from "../../components/world-chat";
import Profile from "../../components/profile";
import SinglePersonChat from "../../components/single-person-chat";
import { useLocation } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const [showComp, setShowComp] = useState(1);
    const location = useLocation();

    /**
     * set state one for first time
     */
    useEffect(() => {
        setShowComp(1);
        console.log('working')


    }, []);

    useEffect(() => {
        console.log(location.pathname)
        location.pathname == '/home' ? setShowComp(1) : location.pathname == '/room' ? setShowComp(2) : location.pathname == '/world-chat' ? setShowComp(3) : location.pathname == '/wall' ? setShowComp(4) : setShowComp(5)
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
                            onClick={() => handleNavbar(1, "/home")}  // Redirect on div click
                        >
                            Home
                        </div>
                        <div
                            style={{ width: "165px" }}
                            className={` navBtn ${showComp === 2 ? "bg-white text-darkBlue" : "bg-darkBlue text-white"}`}
                            onClick={() => handleNavbar(2, "/room")}  // Redirect on div click
                        >
                            Rooms
                        </div>
                        <div
                            style={{ width: "167px" }}
                            className={`navBtn ${showComp === 3 ? "bg-white text-darkBlue" : "bg-darkBlue text-white"}`}
                            onClick={() => handleNavbar(3, "/world-chat")}  // Redirect on div click
                        >
                            World Chat
                        </div>
                        <div
                            style={{ width: "167px" }}
                            className={` navBtn ${showComp === 4 ? "bg-white text-darkBlue" : "bg-darkBlue text-white"}`}
                            onClick={() => handleNavbar(4, "/wall")}  // Redirect on div click
                        >
                            Wall
                        </div>

                        <div
                            style={{ width: "167px" }}
                            className={` navBtn ${showComp === 5 ? "bg-white text-darkBlue" : "bg-darkBlue text-white"}`}
                            onClick={() => handleNavbar(5, "/profile")}  // Redirect on div click
                        >
                            Profile
                        </div>
                    </div>
                    <div className="auth-main">
                        {showComp == 1 && <><SinglePersonChat /></>}
                        {showComp == 2 && <><RoomChat /></>}
                        {showComp == 3 && <><WorldChat /> </>}
                        {showComp == 4 && <><Wall /></>}
                        {showComp == 5 && <><Profile /></>}
                    </div>



                </div>
            </div>
        </>
    );
}

export default Home;
