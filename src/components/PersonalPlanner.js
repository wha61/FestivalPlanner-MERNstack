import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { addActivity, removeActivity } from "../store/personalPlannerSlice";
import "../App.css";

const PersonalPlanner = () => {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const navigate = useNavigate(); // Step 1: Get the navigate function

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user = useSelector((state) => state.user.user);
  let userId, userRole;
  if (isLoggedIn) {
      userId = user._id;
      userRole = user.role;
  }
  const plannerId = user?.planner;
  //CHECK FOR CORRECT USER PLANNER AND EVENT
  // console.log("userID:" + userId);
  // console.log("PlannerID: " + user?.planner);
  // console.log("EventID: " + eventId);

  // These are the activities that the user has added to their planner.
  const userActivities = useSelector((state) => state.personalPlanner.activities);
  const filteredUserActivities = userActivities.filter(activity => activity.event_id === eventId);

  // These are all the other activities that the user can add to their planner.
  const [availableActivities, setAvailableActivities] = useState([]);


  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login page (change the path as needed)
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchEventActivities = async () => {

      // Then fetch the activities for the event:
      const activitiesUrl = `http://localhost:3001/api/activities/event/${eventId}`;
      try {
          const activitiesResponse = await fetch(activitiesUrl);

          if (activitiesResponse.ok) {
              let activitiesData = await activitiesResponse.json();

              // Remove the activities that are already in the user's planner
              activitiesData = activitiesData.filter(activity => 
                !userActivities.some(userActivity => userActivity.activity_id === activity.activity_id)
              );
              setAvailableActivities(activitiesData);
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
    fetchEventActivities();
  }, [plannerId, eventId]);

  const handleAddActivity = async (activity) => {
    dispatch(addActivity(activity));
  
    // Remove the activity from the available activities list.
    setAvailableActivities(prevActivities =>
      prevActivities.filter(a => a.activity_id !== activity.activity_id)
    );
  
    // Update the planner in the database.
    await fetch(`http://localhost:3001/api/planner/${userId}/event/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activities: userActivities.concat([activity.activity_id]) }),
    });
  };
  
  const handleRemoveActivity = async (activity) => {
    dispatch(removeActivity(activity));
  
    // Add the activity back to the available activities list.
    setAvailableActivities(prevActivities => [...prevActivities, activity]);
  
    // Update the planner in the database.
    await fetch(`http://localhost:3001/api/planner/${userId}/event/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activities: userActivities.filter(a => a.activity_id !== activity.activity_id) }),
    });
  };


  return (
    <div className="row mt-4">
      <div className="col-md-6">
        <h1>My Activities</h1>
        {filteredUserActivities.map(activity => (
          <div key={activity.activity_id} className="activity-container">
            <div>
              <h3 className="activity-title">{activity.name}</h3>
              <p className="activity-description">{activity.description}</p> {/* Added line */}
              <p className="activity-location">{activity.location}</p>
            </div>
            <button
              className="btn btn-primary activity-button"
              onClick={() => handleRemoveActivity(activity)}>-</button>
          </div>
        ))}
      </div>
    
      <div className="col-md-6">
        <h1>Available Activities</h1>
        {availableActivities.map(activity => (
          <div key={activity.activity_id} className="activity-container">
            <div>
              <h3 className="activity-title">{activity.name}</h3>
              <p className="activity-description">{activity.description}</p> {/* Added line */}
              <p className="activity-location">{activity.location}</p>
            </div>
            <button
              className="btn btn-primary activity-button"
              onClick={() => handleAddActivity(activity)}>+</button>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary activity-button centered-button"
        onClick={() => navigate(-1)}>
        Save
      </button>
      
    </div>
  );
};

export default PersonalPlanner;
