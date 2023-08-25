# Project Name

Festival Planner is a cutting-edge web application designed to enhance the festival-going experience for both organizers and attendees. Acting as a comprehensive hub, it offers real-time updates and personalized planning tools tailored to various large-scale events, including music festivals, conventions, and carnivals.

For event organizers, Festival Planner provides the ability to post activities, manage event details, and even integrate ticketing solutions. Event attendees can explore and save events, create personalized schedules from the available line-up, and share them via social media platforms like Facebook and Instagram.

The application goes beyond basic scheduling, linking to external services such as Google Maps, Spotify, weather forecasts, all designed to augment the user's event experience. Whether it's finding the event location, exploring artist tracks, checking the weather, or reading food vendor reviews, Festival Planner centralizes these features in one seamless experience.

Implemented using technologies such as MongoDB Atlas, Google Cloud, React, Node.js, and Express.js, this project reflects a concerted effort to bridge the gap between digital convenience and real-world festivities. Its architecture is robust, scalable, and tailored to meet the diverse needs of users, making it an indispensable tool for enjoying large-scale gatherings. Crafted by a skilled team of developers, Festival Planner stands as a testament to innovative thinking and the potential of modern web development.

### Start the Server
Navigate to the server directory:

cd ./server
node server.js

### Start the App
At the root folder (same as this README file):

npm start


## Roles and Responsibilities

### Milestone 1
- **User Service:** Vivian
- **Saved Event Service:** Andy
- **Organizer Service:** Bruce
- **Profile Services:** John

### User Service
Responsible for user-related functionalities, including:
- **User Registration**: Authenticating and managing basic profile.
- **Authentication Tokens**: Handling user login and generating tokens.

### Saved Event Service
Manages the functionality of saving and retrieving saved festivals for each user, including:
- **Storing Information**: About festivals marked as favorites or wished to attend.
- **APIs**: To add, remove, and retrieve saved festivals.

### Organizer Service
Provides functionality for festival organizers:
- **Uploading Information**: About projects, including festival name, description, location, etc.
- **Storing Information**: For later retrieval.

### Profile Service
Handles advanced user profile management functionalities:
- **Storing Additional Information**: Such as name, address, contact details, etc.
- **APIs**: For updating and retrieving detailed profiles.

---
