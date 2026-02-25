const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve index.html

// MongoDB Connection
mongoose.connect("mongodb+srv://enzmamulhaque3127_db_user:31273127@cluster0.vbyg4ju.mongodb.net/mydb?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);



// ======================
// SIGNUP (Hash Password)
// ======================
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("User Already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.send("Signup Successful");
  } catch (err) {
    console.log(err);
    res.send("Error Occurred");
  }
});



// ======================
// SIGNIN (Compare Hash)
// ======================
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.send("User Not Found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.send("Login Successful");
    } else {
      res.send("Wrong Password");
    }

  } catch (err) {
    console.log(err);
    res.send("Error Occurred");
  }
});



// Server Start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
