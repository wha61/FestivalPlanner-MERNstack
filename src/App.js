import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { Route, Routes, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "./store/userSlice";
import Cookies from "js-cookie";
import "./App.css";

import Homepage from "./components/Homepage";
import Organizer from "./components/Organizer";
import UserSignup from "./components/UserSignup";
import UserLogin from "./components/UserLogin";
import PersonalProfile from "./components/Profile";
import UpdateProfile from "./components/UpdateProfile";
import EventDetail from "./components/EventDetail";
import AddActivity from "./components/AddActivityComp";
import EditActivity from "./components/EditActivity";
import UserEvent from "./components/UserEvent";
import Chatroom from "./components/Chatroom";
import EventEdit from "./components/EventEdit";
import PersonalPlanner from './components/PersonalPlanner';

import logoImage from "./images/title.png";
import userImage from "./images/user.png";
import organizerImage from "./images/administrator.png";

const App = () => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    let userId, userRole;
    if (isLoggedIn) {
        userId = user._id;
        userRole = user.role;
    }

    const getUserFromCookies = async () => {
        const token = Cookies.get("token");

        if (token) {
            try {
                // console.log("Validating token...");
                const response = await fetch(
                    "http://localhost:3001/api/auth/validate",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `${token}`,
                        },
                    }
                );

                if (response.ok) {
                    // console.log("Token is valid.");
                    const data = await response.json();
                    dispatch(setUser(data.user));
                } else {
                    // console.log("Token is invalid.");
                    Cookies.remove("token");
                    dispatch(clearUser());
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        getUserFromCookies();
    }, [isLoggedIn, dispatch]);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:3001/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            dispatch(clearUser());
            Cookies.remove("token");
        } catch (error) {
            console.error(error);
            alert("Error occurred while logging out");
        }
    };
    return (
        <>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light w-100">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img
                            src={logoImage}
                            alt="Logo"
                            width="150"
                            height="30"
                        />
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div
                        className="collapse navbar-collapse ms-auto"
                        id="navbarNav"
                    >
                        <ul className="navbar-nav ms-auto">
                            {userRole === "admin" ? (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/user-events"
                                    >
                                        My Events
                                    </Link>
                                </li>
                            ) : null}
                            {userRole === "user" ? (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/user-events"
                                    >
                                        Saved Events
                                    </Link>
                                </li>
                            ) : null}
                            {userRole === "admin" ? (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/events">
                                        Create Event
                                    </Link>
                                </li>
                            ) : null}

                            {isLoggedIn ? (
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle d-flex align-items-center"
                                        href="#"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {userRole === "admin" ? (
                                            <img
                                                src={organizerImage}
                                                alt="User"
                                                width="30"
                                                height="30"
                                                className="me-2" 
                                            ></img>
                                        ) : null}
                                        {userRole === "user" ? (
                                            <img
                                                src={userImage}
                                                alt="User"
                                                width="30"
                                                height="30"
                                                className="me-2" 
                                            ></img>
                                        ) : null}
                                        <p className="m-0">{user.username}</p> 
                                    </a>
                                    <ul
                                        className="dropdown-menu dropdown-menu-end"
                                        aria-labelledby="navbarDropdown"
                                    >
                                        <li>
                                            <Link
                                                className="nav-link"
                                                to="/profile"
                                            >
                                                Profile
                                            </Link>
                                        </li>

                                        <li>
                                            <hr className="dropdown-divider"></hr>
                                        </li>
                                        <li>
                                            <Link
                                                className="nav-link"
                                                to="/"
                                                onClick={handleLogout}
                                                style={{ color: "#FF5A5F" }}
                                            >
                                                Log out
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            ) : (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/login"
                                        style={{ color: "#1DA1F2" }}
                                    >
                                        Log in
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" element={<UserLogin />} />
                    <Route path="/signup" element={<UserSignup />} />
                    <Route path="/events" element={<Organizer />} />
                    <Route path="/profile" element={<PersonalProfile />} />
                    <Route path="/edit/:_id" element={<UpdateProfile />} />
                    <Route path="/events/:eventId" element={<EventDetail />} />
                    <Route
                        path="/events/:eventId/add-activity"
                        element={<AddActivity />}
                    />
                    <Route
                        path="/events/:eventId/activities/:activityId/edit"
                        element={<EditActivity />}
                    />
                    <Route path="/user-events" element={<UserEvent />} />
                    <Route path="/chat" element={<Chatroom />} />
                    <Route path="/edit-event/:eventId" element={<EventEdit />} />
                    <Route path="/personal-planner" element={<PersonalPlanner/>} />
                    <Route path="/personal-planner/:eventId" element={<PersonalPlanner />} />
                </Routes>
            </div>
        </>
    );
};

export default App;
