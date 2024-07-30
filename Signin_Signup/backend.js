
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const jwtPassword = "123456";

mongoose.connect(
"",
);
async function handleLogin(){
  account.createOAuth2Session(
    'google',
    'https://localhost:3000/',
    'https://localhost:3000/fail'
  )
}
const UserProfileSchema = mongoose.model("User", {
name: String,
username: String,
email: String,
dob: String,
password: String,
});

const app = express();
app.use(express.json());
app.use(cors());

async function userExists(username, password) {
try {
const data = await UserProfileSchema.findOne({ username: username });
if(data) return true;
else return false
} catch (err) {
console.error(err);
return false; // Handle errors appropriately
}
}

app.post('/signup', function (req, res){
const name = req.body.name;
const username = req.body.username;
const email=req.body.email;
const dob=req.body.dob;
const password = req.body.password;

const userDetails = new UserProfileSchema({
    name : name,
    username : username,
    email : email,
    dob : dob,
    password : password
});
userDetails.save().then(doc => {
  res.send(doc)
})
.catch(err => console.log(err))
})

app.post("/signin", function (req, res) {
const username = req.body.username;
const password = req.body.password;

if (!userExists(username, password)) {
console.log('from sigup'+ userExists(username, password))
return res.status(403).json({
msg: "User doesnt exist in our in memory db",
});
}

var token = jwt.sign({ username: username }, jwtPassword);
return res.json({
token,
});
});

app.get("/users", async function (req, res) {
const token = req.headers.authorization;
try {
const decoded = jwt.verify(token, jwtPassword);
const username = decoded.username;

const users = await UserProfileSchema.find({ username: { $ne: username } });

return res.status(200).json(users);
} catch (err) {
return res.status(403).json({
msg: "Invalid token",
});
}
});

app.listen(3000, ()=>{
console.log("server is started")
});
