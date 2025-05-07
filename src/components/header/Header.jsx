import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './header.css'
import { } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'

import { addItem } from "../../utils/cartSlice";


function Header(props) {
    const navigate = useNavigate();
    const [showComp, setShowComp] = useState(1);
    const location = useLocation();


    const cart = useSelector((store) => store.cart.items.val)

    /**
     * set state one for first time
     */
    useEffect(() => {
        setShowComp(1);
    }, []);

    useEffect(() => {
        location.pathname == '/home' ? setShowComp(1) : location.pathname == '/room' ? setShowComp(2) : location.pathname == '/world-chat' ? setShowComp(3) : location.pathname == '/wall' ? setShowComp(4) : setShowComp(5)
    }, []);

    const handleNavbar = (param, routePath) => {
        setShowComp(param)
        navigate(routePath);
    };

    const dispatch = useDispatch()

    // const handleAddItem = () => {
    //     dispatch(addItem({val : 'pixxa'}))
    // }

    return (
        <div className="auth-nav">
            <div
                style={{ width: "165px" }}
                className={` navBtn ${showComp === 1 ? "bg-white text-darkBlue" : "bg-darkBlue text-white"}`}
                onClick={() => handleNavbar(1, "/home")}  // Redirect on div click
            >
                Home
            </div>

            {/* <button onClick={handleAddItem}>click  {cart}</button> */}
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
    )
}
export default Header;