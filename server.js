const express = require("express");
require("dotenv").config();
require("./config/db");
const commentRoutes = require("./routes/comment.route");

const app = express();

const Port = process.env.PORT || 3000;

// Middleware and static Path
app.use(express.json());
app.use(express.static("public"));

// routes
app.use("/api", commentRoutes);

// Create Server
const server = app.listen(Port, () => {
  console.log(`Server Running on Port : ${Port}`);
});

//////////////////////////////////////
//------------Socket.io-------------//
//////////////////////////////////////

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  //   console.log(`New Connection ${socket.id}`);

  //   Recieve Event
  socket.on("comment", (data) => {
    // console.log(data);
    data.time = Date(); // set time for broadcast

    socket.broadcast.emit("comments", data);
  });

  socket.on("typing", (data) => {
    console.log(data); // geting username

    socket.broadcast.emit("typing", data);
  });
});
