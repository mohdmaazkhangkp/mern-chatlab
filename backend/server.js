const express = require("express");
const chats = require("./data/data");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
const PORT= process.env.PORT || 5000;



app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// DEPLOYMENT
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
// DEPLOYMENT

const server = app.listen(PORT, ()=>{
    
    console.log("Server running on" + PORT);
})

const io = require("socket.io")(server,{
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:3000"
    },
});
io.on("connection",(socket)=>{
    console.log("connected to socket io");

    socket.on("setup", (userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });

 socket.on("join chat", (room) => {
   socket.join(room);
   console.log("user joined room  "+room);
   //socket.emit("connected");
 });

 socket.on("new message", (newMessageReceived)=>{
    let chat = newMessageReceived.chat;

    if(!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user)=>{
        if(user._id == newMessageReceived.sender._id) return;
        socket.in(user._id).emit("message received", newMessageReceived);
    });
 })
socket.off("setup", () => {
  console.log("User disconnected");
  socket.leave(userData._id)
});
})