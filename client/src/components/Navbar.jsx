import React, { useState } from 'react';
import logoImg from '../assets/logo.png';
import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setLogout } from '../redux/state';
import "../styles/Navbar.scss";

const Navbar = () => {
    const [dropdownMenu, setDropdownMenu] = useState(false);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (search.trim() !== "") {
            navigate(`/properties/search/${search}`);
        }
    };

    return (
        <div className='navbar'>
            <Link to="/">
                <img src={logoImg} alt="logo" />
            </Link>

            <div className='navbar_search'>
                <input
                    type="text"
                    placeholder='Search...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <IconButton onClick={handleSearch} disabled={search.trim() === ""}>
                    <Search sx={{ color: "#4facfe" }} />
                </IconButton>
            </div>

            <div className="navbar_right">
                <Link to={user ? "/create-listing" : "/login"} className="host">
                    Become a host
                </Link>

                <button
                    className="navbar_right_account"
                    onClick={() => setDropdownMenu(!dropdownMenu)}
                >
                    <Menu sx={{ color: "#969393" }} />
                    {user ? (
                        <img
                            src={user.profileImagePath} // <-- Use Cloudinary URL directly
                            alt="Profile photo"
                            style={{ objectFit: "cover", borderRadius: "50%", width: "30px", height: "30px" }}
                            loading="lazy"
                        />
                    ) : (
                        <Person sx={{ color: "#969393" }} />
                    )}
                </button>

                {dropdownMenu && !user && (
                    <div className='navbar_right_accountmenu'>
                        <Link to="/login">Log In</Link>
                        <Link to="/register">Sign Up</Link>
                    </div>
                )}

                {dropdownMenu && user && (
                    <div className='navbar_right_accountmenu'>
                        <Link to={`/${user._id}/trips`}>Trip List</Link>
                        <Link to={`/${user._id}/wishList`}>Wish List</Link>
                        <Link to={`/${user._id}/properties`}>Property List</Link>
                        <Link to={`/${user._id}/reservations`}>Reservation List</Link>
                        <Link to="/create-listing">Become A Host</Link>
                        <Link to="/login" onClick={() => dispatch(setLogout())}>Log Out</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
