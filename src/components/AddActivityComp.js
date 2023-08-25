import React, { useState, useEffect } from 'react';
import {  useParams, useNavigate } from 'react-router-dom'; 
import { v4 as uuidv4 } from 'uuid';


const AddActivity = () => {
  const { eventId } = useParams(); // 从路由参数中获取 eventId
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [formData, setFormData] = useState({
    event_id: eventId, 
    activity_id: '',
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    location: ''
  });
  
  useEffect(() => {
    const fetchEventData = async () => {
      const response = await fetch(`http://localhost:3001/api/events/${eventId}`);
      const event = await response.json();
      
      // Parse date string into Date object and format it
      const startDateObj = new Date(event.start_date);
      const endDateObj = new Date(event.end_date);
  
      const formattedStartDate = `${startDateObj.getFullYear()}-${String(startDateObj.getMonth() + 1).padStart(2, '0')}-${String(startDateObj.getDate()).padStart(2, '0')}`;
      const formattedEndDate = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth() + 1).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}`;
      
      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
    };
  
    fetchEventData();
  }, [eventId]);

    // Update formData when startDate or endDate changes
    useEffect(() => {
      if(startDate && endDate) {
        setFormData(prevState => ({
          ...prevState,
          start_date: startDate,
          end_date: endDate
        }));
      }
    }, [startDate, endDate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const generatedActivityId = uuidv4();

    const url = 'http://localhost:3001/api/activities';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...formData, activity_id: generatedActivityId})
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Activity created successfully:', data.activity);

        navigate(`/events/${eventId}`); //returns user to listing
      } else {
        console.log('Error creating activity:', response.status);
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
  };

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

        <button type="submit" className="btn btn-primary">Create Activity</button>
      </form>
    </div>
  );
};

export default AddActivity;
