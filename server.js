const express = require("express");
const mongoose = require("mongoose");
//const connectDB = require("./config/db");

//const users = require("./routes/api/users");
//const profile = require("./routes/api/profile");
//const posts = require("./routes/api/posts");

const app = express();

// DB Config
const db = require("./config/keys").mongoURI;

//Initialize middleware
app.use(express.json({ extended: false }));

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("Database Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("API Running"));

// Use Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
//app.use("/api/profile", profile);
//app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
