import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { GoogleMap, Marker, LoadScriptNext } from "@react-google-maps/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Organizer = () => {
    const navigate = useNavigate();
    const currentDate = new Date().toISOString().split("T")[0];
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const user = useSelector((state) => state.user.user);
    const userId = isLoggedIn ? user._id : null;

    const [festival, setFestival] = useState({
        event_id: "",
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
        playlistLink: "",
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [mapCenter] = useState({ lat: 49.2827, lng: -123.1207 });
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "playlistLink") {
            const playlistId = extractPlaylistIdFromLink(value);
            setFestival((prevState) => ({
                ...prevState,
                [name]: value.trim() === "" ? null : playlistId,
            }));
        } else {
            setFestival((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }

        setErrors((prevState) => ({
            ...prevState,
            [name]: "",
        }));
    };

    const handleMapClick = (event) => {
        const { latLng } = event;
        const lat = latLng.lat();
        const lng = latLng.lng();
        setSelectedLocation({ lat, lng });

        setFestival((prevState) => ({
            ...prevState,
            location: `${lat}, ${lng}`,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!festival.name) {
            newErrors.name = "Enter the event name";
        }
        if (!festival.description) {
            newErrors.description = "Enter the description";
        }
        if (!festival.start_date) {
            newErrors.start_date = "Enter the start date";
        }
        if (!festival.start_time) {
            newErrors.start_time = "Enter the start time";
        }
        if (!festival.end_date) {
            newErrors.end_date = "Enter the end date";
        }
        if (!festival.end_time) {
            newErrors.end_time = "Enter the end time";
        }
        if (!festival.location) {
            newErrors.location = "Enter the location";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append("event_id", uuidv4());
            formData.append("name", festival.name);
            formData.append("user_id", userId);
            formData.append("description", festival.description);
            formData.append("start_date", festival.start_date);
            formData.append("start_time", festival.start_time);
            formData.append("end_date", festival.end_date);
            formData.append("end_time", festival.end_time);
            formData.append("location", festival.location);
            formData.append("image", selectedFile);
            formData.append("playlistLink", festival.playlistLink);
            const response = await axios.post(
                "http://localhost:3001/api/events",
                formData
            );

            // 让代码暂停一段时间以确保事件已经被保存
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const eventId = response.data._id;
            const response1 = await axios.post(
                "http://localhost:3001/api/user/save",
                { userId, eventId }
            );
            console.log(response1.data.message);

            setFestival({
                event_id: "",
                name: "",
                description: "",
                start_date: "",
                start_time: "",
                end_date: "",
                end_time: "",
                location: "",
                playlistLink: "",
            });

            setErrors({});
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };
    const extractPlaylistIdFromLink = (link) => {
        const startIndex = link.lastIndexOf("/") + 1;
        const endIndex = link.indexOf("?");
        return link.substring(startIndex, endIndex);
    };
    return (
        <>
            <h1 className="organizer_tittle">Create event</h1>
            <div className="col-md align-items-center">
                <form onSubmit={handleSubmit} className="organizer_form">
                    <div className="row mb-3">
                        <label className="form-label">
                            Event name:
                            <input
                                type="text"
                                name="name"
                                value={festival.name}
                                onChange={handleChange}
                                className="form-control"
                            />
                            {errors.name && (
                                <p className="error-message">{errors.name}</p>
                            )}
                        </label>
                    </div>
                    <div className="row mb-3">
                        <label className="form-label">
                            Description:
                            <textarea
                                name="description"
                                value={festival.description}
                                onChange={handleChange}
                                className="form-control"
                            />
                            {errors.description && (
                                <p className="error-message">
                                    {errors.description}
                                </p>
                            )}
                        </label>
                    </div>
                    <div className="row">
                        <div className="col-md">
                            <label className="form-label">
                                Start date:
                                <input
                                    type="date"
                                    name="start_date"
                                    value={festival.start_date}
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
                                    value={festival.start_time}
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
                                    value={festival.end_date}
                                    onChange={handleChange}
                                    className="form-control"
                                    min={festival.start_date}
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
                                    value={festival.end_time}
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
                    <div className="mb-3">
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
                                value={festival.playlistLink}
                                onChange={handleChange}
                                className="organizer_input"
                            />
                            {errors.playlistLink && (
                                <p className="error_message">
                                    {errors.playlistLink}
                                </p>
                            )}
                        </label>
                    </div>
                    <LoadScriptNext googleMapsApiKey="AIzaSyDZ0Sr7v2cjwBc5AJKnw9uXS7uOGkRqrC4">
                        <GoogleMap
                            mapContainerStyle={{
                                height: "400px",
                                width: "100%",
                            }}
                            zoom={10}
                            center={mapCenter}
                            onClick={handleMapClick}
                        >
                            {selectedLocation && (
                                <Marker position={selectedLocation} />
                            )}
                        </GoogleMap>
                    </LoadScriptNext>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
};

export default Organizer;
