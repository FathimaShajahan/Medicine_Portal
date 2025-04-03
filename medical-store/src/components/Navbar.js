import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slice/authSlice";
import './Navbar.css';  // Ensure correct CSS import

const Navbar = ({ onSearch }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const token = useSelector((state) => state.auth.token);
    const [searchTerm, setSearchTerm] = useState("");

    // Show search bar only on "/list-medicine"
    const isSearchVisible = token && location.pathname === "/list-medicine";

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (isSearchVisible && onSearch) {
            onSearch(value);  // Pass the search term to the parent component
        }
    };

    // Redirect to login if user is not logged in
    const handleProtectedNavigation = (path) => {
        if (!token) {
            navigate("/login");
        } else {
            navigate(path);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo logo-link">
                    <h1>MEDIXHUB</h1>
                </div>

                {/* ✅ Show search bar ONLY on "/list-medicine" */}
                {isSearchVisible && (
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search Medicine..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                )}
            
                <div className="nav-links">
                    {token ? (
                        <>
                            <button className="nav-link" onClick={() => handleProtectedNavigation("/")}>Home</button>
                            <button className="nav-link" onClick={() => handleProtectedNavigation("/add-medicine")}>Add Medicine</button>
                            <button className="nav-link" onClick={() => handleProtectedNavigation("/list-medicine")}>List Medicine</button>
                            <button onClick={() => dispatch(logout())} className="logout-btn">Logout</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="nav-link">Login</NavLink>
                            <NavLink to="/signup" className="nav-link">Signup</NavLink>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
