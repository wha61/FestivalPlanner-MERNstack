import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import EventCard from "./EventCardComp";

const UserEvent = () => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const user = useSelector((state) => state.user.user);
    const [events, setEvents] = useState([]);
    let userId, userRole;
    if (isLoggedIn) {
        userId = user._id;
        userRole = user.role;
    }

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/api/user/${userId}`
                );
                const data = response.data;
                setEvents(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (isLoggedIn) {
            fetchEvents();
        }
    }, [userId, isLoggedIn]);

    if (events.length === 0) {
        if (userRole === "admin") {
            return (
                <section className="vh-100" style={{ backgroundColor: "#eee" }}>
                    <div className="container py-5 h-100">
                        <div className=" d-flex justify-content-center align-items-center h-100">
                            <p>
                                Create your first event{" "}
                                <a
                                    href="/events"
                                    style={{
                                        color: "#393f81",
                                    }}
                                >
                                    here
                                </a>
                            </p>
                        </div>
                    </div>
                </section>
            );
        }
        if (userRole === "user") {
            return (
                <section className="vh-100" style={{ backgroundColor: "#eee" }}>
                    <div className="container py-5 h-100">
                        <div className=" d-flex justify-content-center align-items-center h-100">
                            <p>
                                Go to <a href="/">Homepage</a> to save an event
                                and create your personalized schedule
                            </p>
                        </div>
                    </div>
                </section>
            );
        }
    }

    return (
        <>
            <section style={{ backgroundColor: "#eee" }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center ">
                        <div className="col col-xl-10">
                            {isLoggedIn && userRole === "admin" ? (
                                <div className="d-flex align-items-center mb-3 pb-1">
                                    <span className="h1 fw-bold mb-0">
                                        My events
                                    </span>
                                </div>
                            ) : null}
                            {isLoggedIn && userRole === "user" ? (
                                <div className="d-flex align-items-center mb-3 pb-1">
                                    <span className="h1 fw-bold mb-0">
                                        Saved events
                                    </span>
                                </div>
                            ) : null}
                        </div>
                        <div className="event-list">
                            {events.map((event, index) => (
                                <div key={index} className="event-item">
                                    <EventCard event={event} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default UserEvent;
