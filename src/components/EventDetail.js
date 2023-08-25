import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { LoadScriptNext } from "@react-google-maps/api";
import "../style/EventDetail.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    InputGroup,
    FormControl,
    Button,
    Card,
    Container,
    Row,
} from "react-bootstrap";

const EventDetails = () => {
    const [event, setEvent] = useState({});
    const [activities, setActivities] = useState([]); // New state for activities
    //New state for Search and Spotify Token
    const [searchInput, setSearchInput] = useState([]);
    const [accessToken, setAccessToken] = useState([]);
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);

    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const user = useSelector((state) => state.user.user);

    //Spotify token
    const CLIENT_ID = "98d77415c0ed452a960953d85087a516";
    const CLIENT_SECRET = "903b26a492de45d3a0446f8a02d86764";

    let userId, userRole;
    if (isLoggedIn) {
        userId = user._id;
        userRole = user.role;
    }

    // Add state for the map marker
    const [markerPosition, setMarkerPosition] = useState(null);
    const [locationAddress, setLocationAddress] = useState("");

    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            // console.log(eventId);
            // console.log(event);
            const url = `http://localhost:3001/api/events/${eventId}`;

            try {
                const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();
                    setEvent(data);

                    // Assume the location is a string with format 'lat,lng'
                    const [lat, lng] = data.location.split(",");
                    setMarkerPosition({
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                    });

                    // Fetch address using Geocoding API
                    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDZ0Sr7v2cjwBc5AJKnw9uXS7uOGkRqrC4`;
                    const geocodingResponse = await fetch(geocodingUrl);
                    const geocodingData = await geocodingResponse.json();

                    if (
                        geocodingResponse.ok &&
                        geocodingData.results.length > 0
                    ) {
                        setLocationAddress(
                            geocodingData.results[0].formatted_address
                        );
                    } else {
                        console.log(
                            "Error fetching location address:",
                            geocodingResponse.status
                        );
                    }
                } else {
                    console.log("Error fetching event:", response.status);
                }
            } catch (error) {
                console.log("Error:", error.message);
            }

            // Then fetch the activities for the event:
            const activitiesUrl = `http://localhost:3001/api/activities/event/${eventId}`;
            try {
                const activitiesResponse = await fetch(activitiesUrl);

                if (activitiesResponse.ok) {
                    const activitiesData = await activitiesResponse.json();
                    setActivities(activitiesData);
                } else {
                    console.log(
                        "Error fetching activities:",
                        activitiesResponse.status
                    );
                }
            } catch (error) {
                console.log("Error:", error.message);
            }
        };

        //Fetch SPOITFY API Calls
        const fetchAccessToken = async () => {
            try {
                const authParameters = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body:
                        "grant_type=client_credentials&client_id=" +
                        CLIENT_ID +
                        "&client_secret=" +
                        CLIENT_SECRET,
                };
                const response = await fetch(
                    "https://accounts.spotify.com/api/token",
                    authParameters
                );
                const data = await response.json();
                setAccessToken(data.access_token);
            } catch (error) {
                console.log(
                    "Error fetching Spotify access token:",
                    error.message
                );
            }
        };
        fetchAccessToken();
        fetchEvent();
    }, [eventId]);

    async function search() {
        console.log("Access token: " + accessToken);
        var searchParameters = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
            },
        };
        var artistID = await fetch(
            "https://api.spotify.com/v1/search?q=" +
                searchInput +
                "&type=artist",
            searchParameters
        )
            .then((response) => response.json())
            .then((data) => {
                return data.artists.items[0].id;
            });

        var artistTopSongs = await fetch(
            "https://api.spotify.com/v1/artists/" +
                artistID +
                "/top-tracks" +
                "?market=US",
            searchParameters
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setSongs(data.tracks);
            });
    }
    const handleEventDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmed) {
            return;
        }

        const url = `http://localhost:3001/api/events/${eventId}`;

        try {
            const response = await fetch(url, { method: "DELETE" });

            if (response.ok) {
                navigate("/");
            } else {
                console.log("Error deleting event:", response.status);
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const eventId = event._id;
            console.log("event _id is " + eventId);
            const response1 = await axios.post(
                "http://localhost:3001/api/user/remove",
                { userId, eventId }
            );
            console.log(response1.data.message);
            navigate("/user-events");
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    const handleActivityDelete = async (activityId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this activity?"
        );

        if (!confirmed) {
            return;
        }
        const url = `http://localhost:3001/api/activities/${activityId}`;

        try {
            const response = await fetch(url, { method: "DELETE" });

            if (response.ok) {
                setActivities((prevActivities) =>
                    prevActivities.filter(
                        (activity) => activity.activity_id !== activityId
                    )
                );
            } else {
                console.log("Error deleting activity:", response.status);
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

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

    const handleClearSearch = () => {
        // Clear the search input and songs array
        setSearchInput("");
        setSongs([]);
    };

    return (
        <div className="container-fluid p-0">
            {imageData ? (
                <div className="image-container">
                    <img
                        src={imageData}
                        alt={event.name}
                        className="cover-image"
                    />
                </div>
            ) : (
                <p>No image provided</p>
            )}
            <div className="container py-4">
                <div className="row mt-4">
                    <div className="col-md-6">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <h1>{event.name}</h1>
                        </div>
                        <p>{event.description}</p>
                        <p>
                            Start:{" "}
                            {new Date(event.start_date).toLocaleDateString()} at{" "}
                            {event.start_time}
                        </p>
                        <p>
                            End: {new Date(event.end_date).toLocaleDateString()}{" "}
                            at {event.end_time}
                        </p>
                        <p>Location: {locationAddress}</p>
                        {userRole === "admin" && event.user_id === userId ? (
                            <div className="row  ">
                                <div className="col-md-6">
                                    <Link to={`/edit-event/${eventId}`}>
                                        <button className="btn btn-primary">
                                            Edit Event
                                        </button>
                                    </Link>
                                </div>
                                <div className="col-md-6">
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleEventDelete}
                                    >
                                        Delete Event
                                    </button>
                                </div>
                            </div>
                        ) : null}
                        {userRole === "user" && (
                            <div>
                                <Link to={`/personal-planner/${eventId}`}>
                                    <button className="btn btn-info">
                                        Go to Personal Planner
                                    </button>
                                </Link>
                            </div>
                        )}
                        <br></br>

                        <div>
                            <h1>Activities</h1>
                            {activities.map((activity) => (
                                <div
                                    key={activity.activity_id}
                                    className="activity-item"
                                >
                                    <div>
                                        <h3>{activity.name}</h3>
                                        <p>{activity.location}</p>
                                    </div>

                                    {/* Add delete and button for each activity */}
                                    {userRole === "admin" &&
                                    event.user_id === userId ? (
                                        <div>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() =>
                                                    navigate(
                                                        `/events/${eventId}/activities/${activity.activity_id}/edit`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>
                                            <span>&nbsp;</span>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() =>
                                                    handleActivityDelete(
                                                        activity.activity_id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                            {userRole === "admin" &&
                            event.user_id === userId ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        navigate(
                                            `/events/${eventId}/add-activity`
                                        )
                                    }
                                >
                                    Add Activity
                                </button>
                            ) : null}
                            <br></br> <br></br>
                            <h1>Location</h1>
                            <p>{locationAddress}</p>
                            <div style={{ width: "100%", height: "400px" }}>
                                <LoadScriptNext googleMapsApiKey="AIzaSyDZ0Sr7v2cjwBc5AJKnw9uXS7uOGkRqrC4">
                                    <GoogleMap
                                        id="event-location-map"
                                        mapContainerStyle={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                        zoom={10}
                                        center={markerPosition}
                                    >
                                        {markerPosition && (
                                            <Marker position={markerPosition} />
                                        )}
                                    </GoogleMap>
                                </LoadScriptNext>
                            </div>
                        </div>
                        <div className="floating-chat-button">
                            <Link to={`/chat`}>
                                <div className="chat-icon"></div>
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-6">
                        {event.playlistLink != "null" && (
                            <>
                                <h2>Official Event Playlist</h2>
                                <iframe
                                    style={{ borderRadius: 12 }}
                                    src={`https://open.spotify.com/embed/playlist/${event.playlistLink}`}
                                    width="100%"
                                    height="352"
                                    frameBorder="0"
                                    allowFullScreen=""
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                ></iframe>
                            </>
                        )}
                        <br></br>
                        <br></br>
                        <h2>Top Songs By Artists</h2>
                        <p>
                            {" "}
                            See the top 10 most popular songs by an artist in
                            our lineup!{" "}
                        </p>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Search for Artist"
                                type="input"
                                onKeyPress={(event) => {
                                    if (event.key == "Enter") {
                                        search();
                                    }
                                }}
                                onChange={(event) =>
                                    setSearchInput(event.target.value)
                                }
                            />
                            <Button onClick={search}> Search Artist </Button>
                            {searchInput && ( // Check if the search input is not empty
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={handleClearSearch}
                                >
                                    Clear
                                </button>
                            )}
                        </InputGroup>
                        <Container>
                            {songs.length > 0 && (
                                <Row className="mx-2 row row-cols-5">
                                    {songs.map((tracks, i) => {
                                        return (
                                            <Card>
                                                <Card.Img
                                                    src={
                                                        tracks.album.images[0]
                                                            .url
                                                    }
                                                />
                                                <Card.Body>
                                                    <Card.Title>
                                                        {" "}
                                                        {tracks.name}{" "}
                                                    </Card.Title>
                                                </Card.Body>
                                            </Card>
                                        );
                                    })}
                                </Row>
                            )}
                        </Container>
                    </div>

                    <div className="row mt-4"></div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
