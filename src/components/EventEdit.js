import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { GoogleMap, Marker, LoadScriptNext } from "@react-google-maps/api";

const EventEdit = () => {
    const navigate = useNavigate();
    const currentDate = new Date().toISOString().split("T")[0];
    const { eventId } = useParams();
    const [event, setEvent] = useState({
        name: "",
        description: "",
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
        location: "",
        playlistLink: "", 
    });

    const [errors, setErrors] = useState({
        name: "",
        description: "",
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
        location: "",
    });

    const [locationAddress, setLocationAddress] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    useEffect(() => {
        const fetchEvent = async () => {
            console.log(eventId);
            console.log(event);
            const url = `http://localhost:3001/api/events/${eventId}`;

            try {
                const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();
                    setEvent(data);

                    // Assume the location is a string with format 'lat,lng'
                    const [lat, lng] = data.location.split(",");
                    setSelectedLocation({
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
        };

        fetchEvent();
    }, [eventId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name==="playlistLink"){
            const playlistId = extractPlaylistIdFromLink(value);
            setEvent((prevState)=>({
                ...prevState,
                [name]: value.trim() === "" ? null : playlistId,
            }));
        } else{
        setEvent({
            ...event,
            [name]: value,
        });
    }

        setErrors({
            ...errors,
            [name]: "",
        });
    };

    const handleMapClick = (event) => {
        const { latLng } = event;
        const lat = latLng.lat();
        const lng = latLng.lng();
        setSelectedLocation({ lat, lng });

        setEvent((prevState) => ({
            ...prevState,
            location: `${lat}, ${lng}`,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!event.name) {
            newErrors.name = "Enter the event name";
        }
        if (!event.description) {
            newErrors.description = "Enter the description";
        }
        if (!event.start_date) {
            newErrors.start_date = "Enter the start date";
        }
        if (!event.start_time) {
            newErrors.start_time = "Enter the start time";
        }
        if (!event.end_date) {
            newErrors.end_date = "Enter the end date";
        }
        if (!event.end_time) {
            newErrors.end_time = "Enter the end time";
        }
        if (!event.location) {
            newErrors.location = "Enter the location";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", event.name);
            formData.append("description", event.description);
            formData.append("start_date", event.start_date);
            formData.append("start_time", event.start_time);
            formData.append("end_date", event.end_date);
            formData.append("end_time", event.end_time);
            formData.append("location", event.location);
            formData.append("playlistLink", event.playlistLink);

            // Append the selected file to the formData if it exists
            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            const response = await axios.patch(
                `http://localhost:3001/api/events/${eventId}/update`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // Set the correct content type for file upload
                    },
                }
            );

            // Let the code pause for a short time to ensure the event has been saved
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setErrors({});
            navigate(`/events/${eventId}`);
            console.log("Response from server:", response.data);
        } catch (error) {
            console.error("Error sending request:", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return ""; // Handle cases where dateString is empty

        const dateObj = new Date(dateString);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate() + 1).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };
    const extractPlaylistIdFromLink = (link) => {
        const startIndex = link.lastIndexOf("/") + 1;
        const endIndex = link.indexOf("?");
        return link.substring(startIndex, endIndex);
      };
    return (
        <>
            <div>
                <h1>Edit event</h1>
                <form onSubmit={handleSubmit} className="organizer_form">
                    <label className="organizer_label">
                        Event name:
                        <input
                            type="text"
                            name="name"
                            value={event.name}
                            onChange={handleChange}
                            className="organizer_input"
                        />
                        {errors.name && (
                            <p className="error-message">{errors.name}</p>
                        )}
                    </label>
                    <label className="organizer_label">
                        Description:
                        <textarea
                            name="description"
                            value={event.description}
                            onChange={handleChange}
                            className="organizer_input"
                        />
                        {errors.description && (
                            <p className="error-message">
                                {errors.description}
                            </p>
                        )}
                    </label>
                    <div className="row">
                        <div className="col-md">
                            <label className="form-label">
                                Start date:
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formatDate(event.start_date)}
                                    onChange={handleChange}
                                    className="form-control"
                                    min={currentDate}
                                />
                                {errors.start_date && (
                                    <p className="error-message">
                                        {errors.start_date}
                                    </p>
                                )}
                            </label>
                        </div>
                        <div className="col-md">
                            <label className="form-label">
                                Start time:
                                <input
                                    type="time"
                                    name="start_time"
                                    value={event.start_time}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                                {errors.start_time && (
                                    <p className="error-message">
                                        {errors.start_time}
                                    </p>
                                )}
                            </label>
                        </div>
                        <div className="col-md">
                            <label className="form-label">
                                End date:
                                <input
                                    type="date"
                                    name="end_date"
                                    value={formatDate(event.end_date)}
                                    onChange={handleChange}
                                    className="form-control"
                                    min={event.start_date}
                                />
                                {errors.end_date && (
                                    <p className="error-message">
                                        {errors.end_date}
                                    </p>
                                )}
                            </label>
                        </div>
                        <div className="col-md">
                            <label className="form-label">
                                End time:
                                <input
                                    type="time"
                                    name="end_time"
                                    value={event.end_time}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                                {errors.end_time && (
                                    <p className="error-message">
                                        {errors.end_time}
                                    </p>
                                )}
                            </label>
                        </div>
                    </div>
                    <br></br>
                    <label className="organizer_label">
                        Cover:
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="organizer_input"
                        />
                    </label>
                {/* Optional Playlist Link Field */}
                <label className="organizer_label">
                    Add Spotify Playlist Link (Optional):
                    <input
                        type="text"
                        name="playlistLink"
                        value={event.playlistLink}
                        onChange={handleChange}
                        className="organizer_input"
                    />
                    {errors.playlistLink && (
                        <p className="error_message">{errors.playlistLink}</p>
                    )}
                </label>
                    <LoadScriptNext googleMapsApiKey="AIzaSyDZ0Sr7v2cjwBc5AJKnw9uXS7uOGkRqrC4">
                        <GoogleMap
                            mapContainerStyle={{
                                height: "400px",
                                width: "100%",
                            }}
                            zoom={10}
                            center={selectedLocation}
                            onClick={handleMapClick}
                        >
                            {selectedLocation && (
                                <Marker position={selectedLocation} />
                            )}
                        </GoogleMap>
                    </LoadScriptNext>

                    <button type="submit" className="organizer_button">
                        Update
                    </button>
                </form>
            </div>
        </>
    );
};

export default EventEdit;
