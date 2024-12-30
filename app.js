const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Http = require('http');
const dotenv = require('dotenv');
dotenv.config();

const sequelize=require('./util/database')
const User = require('./routes/User')
const messages = require('./routes/messages')
const group= require('./routes/group')

const members= require('./routes/members')

const userTable=require("./models/User")
const messagesTable=require("./models/messages")
const groupTable=require("./models/group")
const usergroupTable=require("./models/usergroup")
const adminTable=require("./models/admin")
const archievedChatTable=require("./models/archievedChat")
const app = express();
const cron = require("node-cron");
const archieveMessages = require("./cron/cron");






var cors=require("cors")
const { Server } = require("socket.io");

const server = Http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Replace "*" with your frontend URL for better security
  },
});
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("sendMessage",(message,fileUrl)=>{
    io.emit("receiveMessage",message,fileUrl)
    console.log("message",message)
  })

})





app.use(cors({
  origin: "*",
  credentials: true,
}));

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

userTable.hasMany(messagesTable); // User has many Posts
messagesTable.belongsTo(userTable); 

groupTable.hasMany(messagesTable); // User has many Posts
messagesTable.belongsTo(groupTable); 
userTable.belongsToMany(groupTable, { through: "usergroup" });
groupTable.belongsToMany(userTable, { through: "usergroup"});

usergroupTable.belongsTo(userTable, { foreignKey: 'userId' });
usergroupTable.belongsTo(groupTable, { foreignKey: 'groupId' });

userTable.belongsToMany(groupTable, { through: usergroupTable, foreignKey: 'userId' });
groupTable.belongsToMany(userTable, { through: usergroupTable, foreignKey: 'groupId' });

userTable.belongsToMany(groupTable, { through: "adminGroup" });
groupTable.belongsToMany(userTable, { through: "adminGroup"});

adminTable.belongsTo(userTable, { foreignKey: 'userId' });
adminTable.belongsTo(groupTable, { foreignKey: 'groupId' });

userTable.belongsToMany(groupTable, { through: adminTable, foreignKey: 'userId' });
groupTable.belongsToMany(userTable, { through: adminTable, foreignKey: 'groupId' });


userTable.hasMany(archievedChatTable); // User has many Posts
archievedChatTable.belongsTo(userTable); 

groupTable.hasMany(archievedChatTable); // User has many Posts
archievedChatTable.belongsTo(groupTable); 





app.use("/user",User)
app.use("/messages",messages)
app.use("/group",group)
app.use("/members",members)
cron.schedule("*/5 * * * *", async () => {
  console.log("Starting cron job to archive old messages...");
 await archieveMessages.archieveMessages();}, {
  scheduled: true,
  
});



















sequelize
.sync()
.then(result =>{
  console.log(result)
  const PORT = process.env.PORT || 4000; 
  server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
})
.catch(err =>{
  console.log(err)
})


