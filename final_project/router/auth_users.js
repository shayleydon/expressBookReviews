const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
	users = [{username: "admin", password: "admin"}];

//write code to check is the username is valid
// Check if a user with the given username already exists
const isValid = (username) => { //returns boolean
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Login endpoint, /customer/login
//only registered users can login
//regd_users.post("/login", (req, res) => { //customer/login
regd_users.get("/login", (req, res) => { //customer/login
    //const username = req.body.username;
    //const password = req.body.password;
    const username = "admin";
    const password = "admin";

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(300).json({message: req.session.authorization});
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});


// Add a book review, /customer/auth
//regd_users.put("/auth/review/:isbn", (req, res) => { //customer/auth
regd_users.get("/auth/review/:isbn", (req, res) => { //customer/auth
  //Write your code here
  return res.status(300).json({message: "Review deleted"});
  return res.status(300).json({message: "Review added"});
});
// Add a book review, /customer/auth
regd_users.delete("/auth/review/:isbn", (req, res) => { //customer/auth
  //Write your code here
  return res.status(300).json({message: "Review deleted"});
});
// books, /customer/auth
regd_users.get("/auth/books", (req, res) => { //customer/auth
  //Write your code here
  //return res.status(300).json({books: books, users: users});
  return res.status(300).json({message: "auth books Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
