import React, { useState, useEffect, useMemo } from "react";
import EventCard from "./EventCardComp";
import sortup from "../images/sortingup.png";
import sortdown from "../images/sortingdown.png";
import bgImage from "../images/bg.jpg";

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [eventsPerRow, setEventsPerRow] = useState(2);
    const [sortDate, setSortDate] = useState(false);
    const [sortName, setSortName] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            const url = "http://localhost:3001/api/events"; // Replace with your server URL

            try {
                const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();
                    // Sort the events by date and then by name in ascending order
                    data.sort((a, b) => {
                        const dateComparison =
                            new Date(a.start_date) - new Date(b.start_date);
                        if (dateComparison !== 0) return dateComparison;

                        return a.name.localeCompare(b.name);
                    });

                    setEvents(data);
                } else {
                    console.log("Error fetching events:", response.status);
                }
            } catch (error) {
                console.log("Error:", error.message);
            }
        };

        fetchEvents();
    }, []);

    const gridTemplateColumnsStyle = `repeat(${eventsPerRow}, 1fr)`;

    const handleToggleEventsPerRow = () => {
        setEventsPerRow(eventsPerRow === 1 ? 2 : 1);
    };

    const sortedEvents = useMemo(() => {
        // Sort the events based on sortDate and sortName state
        return events.slice().sort((a, b) => {
            const dateComparison = sortDate
                ? new Date(a.start_date) - new Date(b.start_date)
                : new Date(b.start_date) - new Date(a.start_date);

            if (dateComparison !== 0) {
                return dateComparison;
            }

            return sortName
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });
    }, [events, sortDate, sortName]);

    const handleSortbyDate = () => {
        setSortDate((prevSortDate) => !prevSortDate);
    };

    const handleSortbyName = () => {
        setSortName((prevSortName) => !prevSortName);
    };

    const filteredEvents = sortedEvents.filter((eventItem) =>
        eventItem.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div
                className="background-container"
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            <section style={{ backgroundColor: "#eee" }}>
                <div className="container py-5 h-100">
                    <h1 className="centered-title">Events</h1>
                    <div className="row d-flex justify-content-center align-items-center">
                        <div className="input-group position-relative">
                            <input
                                className="search-bar form-control"
                                type="text"
                                placeholder="Search by event name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ borderRadius: "32px", flex: "1" }}
                            />
                        </div>
                        <div className="col-sm-5 col-md">
                            <div className="d-flex justify-content-end">
                                <div className="toggle-button">
                                    <button onClick={handleToggleEventsPerRow}>
                                        Event per row: {eventsPerRow}
                                    </button>
                                </div>
                                <div className="toggle-button">
                                    <button onClick={handleSortbyDate}>
                                        Sort by: Start Date{" "}
                                        <img
                                            src={sortDate ? sortdown : sortup}
                                            width={20}
                                            height={20}
                                        />
                                    </button>
                                </div>
                                <div className="toggle-button">
                                    <button onClick={handleSortbyName}>
                                        Sort by: Name{" "}
                                        <img
                                            src={sortName ? sortdown : sortup}
                                            width={20}
                                            height={20}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="event-list"
                            style={{
                                gridTemplateColumns: gridTemplateColumnsStyle,
                            }}
                        >
                            {filteredEvents.map((eventItem) => (
                                <div key={eventItem._id} className="event-item">
                                    <EventCard event={eventItem} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EventList;
