import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const EventCard = ({ event }) => {
    const [isExpanded, setExpanded] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const user = useSelector((state) => state.user.user);
    const eventId = event._id;
    let userId, userRole;
    if (isLoggedIn) {
        userId = user._id;
        userRole = user.role;
    }

    useEffect(() => {
        if (isLoggedIn && userRole === "user") {
            const fetchData = async () => {
                try {
                    const response = await fetch(
                        "http://localhost:3001/api/user/check-event",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                userId,
                                eventId,
                            }),
                        }
                    );
                    if (!response.ok) {
                        throw new Error("Failed to check event.");
                    }

                    const exists = await response.json();
                    setIsChecked(exists);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [isLoggedIn, userRole, userId, eventId]);

    const handleCheckboxChange = (eventId) => {
        handleSaveEvent(eventId);
        setIsChecked((prevChecked) => {
            if (prevChecked !== isChecked) {
                console.log(eventId);
            }
            return !prevChecked;
        });
    };

    const handleSaveEvent = async (eventId) => {
        if (!isChecked) {
            try {
                const response = await fetch(
                    "http://localhost:3001/api/user/save",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ userId, eventId }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.log(data.message);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (isChecked) {
            try {
                const response = await fetch(
                    "http://localhost:3001/api/user/remove",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ userId, eventId }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.log(data.message);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleClick = () => {
        setExpanded(!isExpanded);
    };

    const [imageData, setImageData] = useState({});

    const binDataToBlobURL = (binData) => {
        if (!binData || !binData.data || !binData.contentType) {
            return null;
        }

        const contentType = binData.contentType;
        const uint8Array = new Uint8Array(binData.data.data);
        const blob = new Blob([uint8Array], { type: contentType });
        const objectURL = URL.createObjectURL(blob);

        return objectURL;
    };

    useEffect(() => {
        const fetchImageData = async () => {
            if (event && event.image) {
                const objectURL = binDataToBlobURL(event.image);
                setImageData(objectURL);
            }
        };

        fetchImageData();
    }, [event]);

    return (
        <Accordion activeKey={isExpanded ? "0" : null}>
            <Card className="event-card" onClick={handleClick}>
                <Card.Header
                    style={{
                        cursor: "pointer",
                    }}
                >
                    <div className="event-thumbnail">
                        {imageData ? (
                            <img
                                src={imageData}
                                alt={event.name}
                                className="event-image"
                            />
                        ) : (
                            <p>No image provided</p>
                        )}
                    </div>
                    <br></br>
                    <strong className="bold-text">{event.name}</strong>
                    {isLoggedIn && userRole === "user" ? (
                        <>
                            <input
                                type="checkbox"
                                className="btn-check"
                                id={eventId}
                                autoComplete="off"
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(eventId)}
                            ></input>
                            <label
                                htmlFor={eventId}
                                className="btn btn-outline-warning btn-sm"
                                style={{ float: "right" }}
                            >
                                {isChecked ? "Saved" : "Save"}
                            </label>
                        </>
                    ) : null}
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        {/* {event.image ? (
                            <img
                                src={`http://localhost:3001/${event.image}`}
                                alt={event.name}
                                style={{ width: "100%", height: "auto" }}
                            />
                        ) : (
                            <p>No image provided</p>
                        )} */}

                        <p>{event.description}</p>
                        <p>
                            Start Date:{" "}
                            {new Date(event.start_date).toLocaleDateString()}
                        </p>
                        <p>
                            End Date:{" "}
                            {new Date(event.end_date).toLocaleDateString()}
                        </p>
                        {/* <p>Location: {event.location}</p> */}
                        <Link to={`/events/${event.event_id}`}>
                            View Details
                        </Link>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
};

export default EventCard;
