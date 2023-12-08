import React, { useContext, useEffect, useState } from 'react';
import {
    MDBNavbar,
    MDBContainer,
    MDBIcon,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBNavbarToggler,
    MDBCollapse,
    MDBDropdown,
    MDBDropdownMenu,
    MDBDropdownToggle,
    MDBDropdownItem,
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import axios from "axios";
import Authentication from '../../Services/Authentication';
import swal from "sweetalert";
import logo from "../../Assets/Icons/logo-white.png";
import { HOST_URL, getCookie } from '../../Constants';
import { AuthContext } from '../../Context/AuthContext';
import "./header.css";


export default function Header({ isActive, onGetUser = () => { } }) {
    const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const authContext = useContext(AuthContext);



    useEffect(() => {
        setIsLoading(true)
        if (authContext.isAuthenticated) {
            fetchUser()
        }
        else {
            setIsLoading(false)
            setUser([])
        }
    }, []);

    const fetchUser = async () => {
        const res = await axios.get(HOST_URL +"/user/userprofile", {
            withCredentials: true, // Include credentials (cookies) in the request
          }).then((res) => {
            console.log(res)
            if (res.status === 200 && res.data.statusCode === "Success") {
                setUser(res.data.data);
                onGetUser(res.data.data)
            }
            else {
                setUser([]);

            }
            setIsLoading(false)
        }).catch(err => {
            setUser([]);
            setIsLoading(false)
            console.log("🚀 ~ file: Header.js:36 ~ res ~ res:", err)
        })
    };

    const onClickLogoutHandler = () => {
        swal({
            title: "Log Out",
            text: "Are you Sure?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                Authentication.logout().then((data) => {
                    if (data.success) {
                        setUser(data.user);
                        authContext.setIsAuthenticated(false);
                        window.location.href = "/";
                        swal("Success", "Successfully Logout", { icon: "success" });
                    }
                    // else {
                    //   swal("Your Not Logout");}
                });
            }
        });
    };

    return (
        <>
            <nav
                className="navbar sticky-top navbar-expand-lg navbar-dark"
                style={{ backgroundColor: "#2c2c6c" }}
            >
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src={logo} alt="" width="40" height="40" />
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {user.length === 0 ? (
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link to="/" className={isActive === 'Home' ? "nav-link active" : "nav-link"}>
                                        Home
                                    </Link>
                                </li>
                                {!isLoading && <li className="nav-item">
                                    <Link to="/login" className="nav-link">
                                        Login/Register
                                    </Link>
                                </li>}
                            </ul>
                        ) : (
                            <>
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li className="nav-item">
                                        <Link to="/" className={isActive === 'Home' ? "nav-link active" : "nav-link"}>
                                            Home
                                        </Link>
                                    </li>
                                    {user.role === "user" ? (
                                        <>
                                            <li className="nav-item">
                                                <Link to="/my-cart" className="nav-link">
                                                    My Cart
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/my-order" className="nav-link">
                                                    My Orders
                                                </Link>
                                            </li>
                                        </>
                                    ) : user.role === "staff" ? (
                                        <>
                                            <li className="nav-item">
                                                <Link to="/all-customers" className={isActive === 'AllCustomersScreen' ? "nav-link active" : "nav-link"}>
                                                    Customers
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/inventory" className="nav-link">
                                                    Inventory
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/all-orders" className="nav-link">
                                                    All Orders
                                                </Link>
                                            </li>
                                        </>
                                    ) : user.role === "admin" ? (
                                        <>
                                            <li className="nav-item">
                                                <Link to="/allUser" className={isActive === 'AllUsers' ? "nav-link active" : "nav-link"}>
                                                    All Users
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/staff-register" className={isActive === 'StaffRegister' ? "nav-link active" : "nav-link"}>
                                                    Staff Registration
                                                </Link>
                                            </li>
                                        </>

                                    ) : (
                                        <div
                                            className="spinner-border text-warning"
                                            role="status"
                                        ></div>
                                    )}
                                </ul>
                                <div className="scrollStop">
                                    <div className="dropdown">
                                        <span
                                            className="navbar-text profileHeader dropdown-toggle"
                                            type="button"
                                            id="dropdownMenuButton1"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            {user.image &&
                                                <div className="profileHeader-img">
                                                    <img src={user.image} className="headerImg" />
                                                </div>}

                                            <div className="profileHeader-name">
                                                <h6>{user.name}</h6>
                                            </div>
                                        </span>

                                        <ul
                                            className="dropdown-menu dropdown-menu-dark dropdown-menu-end"
                                            aria-labelledby="dropdownMenuButton1"
                                        >
                                            <li>
                                                <Link to="/user-profile" className='dropdown-item'>
                                                    Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li>
                                                <a
                                                    className="dropdown-item logoutBtnHeader"
                                                    onClick={onClickLogoutHandler}
                                                >
                                                    Logout
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}