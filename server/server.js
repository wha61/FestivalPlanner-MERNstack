const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");

const eventRoutes = require("./routes/events");
const profileRoutes = require("./routes/profile-service");
const activityRoutes = require("./routes/activies");
const userSignupRoutes = require("./routes/userSignup");
const userAuthRoutes = require("./routes/userAuth");
const userEvents = require("./routes/userEvents");
const plannerRoutes = require("./routes/planner"); 


const { Server } = require("socket.io");

const PORT = process.env.PORT || 3001; // Change the port to 3001

//Middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(cookieParser());

//Connect to database
const mongoURI =
    "mongodb+srv://cnle:johnnminh22@project-cluster.6u69qwq.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Connected to database");
    })
    .catch((e) => {
        console.log("Failed to connect to database");
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error"));


// Add this middleware before other routes to handle requests to /api/events
app.use("/api/events", eventRoutes);
app.use("/api/signup", userSignupRoutes);
app.use("/api/auth", userAuthRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/user", userEvents);
app.use("/api/planner", plannerRoutes);

// Add socket.io server
var server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  

var clients = 0;

io.on('connection', function(socket){
  clients++;
  var msg = {
    text: 'New user enter the chatroom!!',
    sender: '#'
  };
  socket.broadcast.emit('message', JSON.stringify(msg));
  msg = {
    text: 'You are in the chatroom!',
    sender: '#'
  };
  socket.emit("message", JSON.stringify(msg));
  socket.emit('clientChange', clients); 
  socket.broadcast.emit('clientChange', clients); 


  const chatHandler = function(messageJson) {
    console.log('Received message from client:', messageJson);
    console.log('Broadcasting message to all other clients...');
    io.emit('message', messageJson);
    console.log('Message broadcasted.');
  };

  socket.on('chat', chatHandler);

  
  socket.on('disconnect', function(){
    clients--;
    var msg = {
        text: 'One user left the chatroom',
        sender: '#'
    };
    socket.broadcast.emit('message', JSON.stringify(msg));
    socket.broadcast.emit('clientChange',clients);

    // 移除事件监听器
    
    socket.off('chat', chatHandler);
  });

});

server.listen(PORT, ()=> {
  console.log(`Server is running on port ${PORT}`);
});
