import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './header.css';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const authorizedTab = [
        { label: "Home", path: "/home" },
        { label: "Rooms", path: "/room" },
        { label: "World Chat", path: "/world-chat" },
        { label: "Wall", path: "/wall" },
        { label: "Profile", path: "/profile" },
    ];

    const unauthorizedTab = [
        { label: "Login", path: "/log-in" },
        { label: "Sign-up", path: "/sign-up" },
        { label: "Forget Password", path: "/forget-password" },
    ];

    const [headerTabs, setHeaderTabs] = useState([]);

    useEffect(() => {
        const isLoggedIn = !!localStorage.getItem("user_id");
        setHeaderTabs(isLoggedIn ? authorizedTab : unauthorizedTab);
    }, [location.pathname]);

    const handleNavbar = (path) => {
        navigate(path);
    };

    return (
        <div className="auth-nav">
            {headerTabs.map((tab, idx) => (
                <div
                    key={idx}
                    style={{ width: "165px" }}
                    className={`navBtn ${location.pathname === tab.path ? "bg-white text-darkBlue" : "bg-darkBlue text-white"}`}
                    onClick={() => handleNavbar(tab.path)}
                >
                    {tab.label}
                </div>
            ))}
        </div>
    );
}

export default Header;
