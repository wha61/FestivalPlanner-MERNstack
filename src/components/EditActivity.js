import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditActivity = () => {
  const { eventId, activityId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    event_id: eventId,
    activity_id: activityId,
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    location: ''
  });

  useEffect(() => {
    const fetchActivityData = async () => {
      const response = await fetch(`http://localhost:3001/api/activities/${activityId}`);
      const activity = await response.json();

      activity.start_date = new Date(activity.start_date).toISOString().split('T')[0];
      activity.end_date = new Date(activity.end_date).toISOString().split('T')[0];
      
      setFormData(activity);
    };

    fetchActivityData();
  }, [activityId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = `http://localhost:3001/api/activities/${activityId}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate(`/events/${eventId}`);
      } else {
        console.log('Error updating activity:', response.status);
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
  };
  

  // The form is the same as in AddActivity, but the fields are pre-filled with the activity data
  // and the submit button says "Update Activity" instead of "Create Activity"
  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="event_id" className="form-label">Event ID:</label>
          <input type="text" id="event_id" name="event_id" value={formData.event_id} onChange={handleInputChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description:</label>
          <input type="text" id="description" name="description" value={formData.description} onChange={handleInputChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label htmlFor="start_date" className="form-label">Start Date:</label>
          <input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleInputChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label htmlFor="end_date" className="form-label">End Date:</label>
          <input type="date" id="end_date" name="end_date" value={formData.end_date} onChange={handleInputChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location:</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} className="form-control" required />
        </div>

        <button type="submit" className="btn btn-primary">Update Activity</button>
      </form>
    </div>
  );
};

export default EditActivity;
