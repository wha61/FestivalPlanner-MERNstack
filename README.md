# Festival Planner

**Festival Planner** is a cutting-edge web application designed to enhance the festival-going experience for both organizers and attendees. Acting as a comprehensive hub, it offers real-time updates and personalized planning tools tailored to various large-scale events, including music festivals, conventions, and carnivals.

<img src="/image.png" alt="ttd">
<img src="/image1.png" alt="ttd">
<img src="/image2.png" alt="ttd">
<img src="/image3..png" alt="ttd">
<img src="/chatroom.jpg" alt="ttd">

## Overview
image
For event organizers, Festival Planner provides the ability to post activities, manage event details, and even integrate ticketing solutions. Event attendees can explore and save events, create personalized schedules from the available line-up, and share them via social media platforms like Facebook and Instagram.

The application goes beyond basic scheduling, linking to external services such as Google Maps, Spotify, weather forecasts, all designed to augment the user's event experience. Whether it's finding the event location, exploring artist tracks, checking the weather, or reading food vendor reviews, Festival Planner centralizes these features in one seamless experience.

Implemented using technologies such as **MongoDB Atlas**, **Google Cloud**, **React**, **Node.js**, and **Express.js**, this project reflects a concerted effort to bridge the gap between digital convenience and real-world festivities. Its architecture is robust, scalable, and tailored to meet the diverse needs of users, making it an indispensable tool for enjoying large-scale gatherings. Crafted by a skilled team of developers, Festival Planner stands as a testament to innovative thinking and the potential of modern web development.

<img src="/diagram.png" alt="ttd" style="width: 100%;">
<img src="/structure.png" alt="ttd" style="width: 100%;">

## Setup (to test on local)

### Start the Server

Navigate to the server directory:

    cd ./server
    node server.js


### Start the App

At the root folder (same as this README file):

    npm start


## Services

### User Service

Responsible for user-related functionalities, including:

- User Registration: Authenticating and managing basic profile.
- Authentication Tokens: Handling user login and generating tokens.

### Saved Event Service

Manages the functionality of saving and retrieving saved festivals for each user, including:

- Storing Information: About festivals marked as favorites or wished to attend.
- APIs: To add, remove, and retrieve saved festivals.

### Organizer Service

Provides functionality for festival organizers:

- Uploading Information: About projects, including festival name, description, location, etc.
- Storing Information: For later retrieval.

### Profile Service

Handles advanced user profile management functionalities:

- Storing Additional Information: Such as name, address, contact details, etc.
- APIs: For updating and retrieving detailed profiles.

## Main Features

### Discover and Search Festivals

Users can browse and search for a variety of festival events in our application.

- **Landing Page**: A page for people to browse and search event
  - Search Functions
  - Navigation Bar
  - Routing for all pages
- **Event Details Page**: A place where people can find all the relevant details of an event
  - Activities list (CRUD actions)
  - Event’s Spotify Playlist and utilized Spotify API to implement a search engine for Top 10 songs by any artists
  - Google Map location
  - Fetching Event details (CRUD actions)

### Personalized Schedule Planning

Users can create their own schedule for each festival event and modify it at any time.

- **Personal Planner**: A page for people to view currently available activities and add to their event
  - Available activities list
  - Personalized list for each event
- **Saved Events**: This is where people can see the events they saved
  - Sorting function
  - Save function
- **My Events**: Where event organizer can see events they created, only creators can modify their own event
  - Making calls to DB through the backend
  - Change input data into parseable JSON objects
  - Image upload feature
  - Google Maps pinpoint feature

### Profile Management

State-of-the-art profile management service, using redux, react, JSX to ensure users have the correct access to functionalities relevant to them.

- **User creation**: Adding a user with a specific type
  - MongoDB calls with appropriate backend
  - Login page
  - User Signup page
- **User management**: Authenticate users and API for the rest of the app to check user states
  - Setting up redux and store
  - Authentication backend services
  - Set an HTTP-only cookie containing the JWT token
- **Profile services**: Populate User info and displaying
  - Displaying user info:
    - Username, First and Last Name, Email Address, Pending Events, Selected Social Media link
- **Profile update and linking**: Links to social media about this user and update profile features
  - Links to social media
  - Update profile
  - Update name, username, password

### Chat Room

A chat room where users can find friends and discuss with other users.

- Talk with others that interested in the same events
- Check current online users

