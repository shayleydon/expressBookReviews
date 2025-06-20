const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
//public_users.post("/register", (req,res) => {
public_users.get("/register", (req,res) => {
    //const username = req.body.username;
    //const password = req.body.password;
    const username = "newadmin";
    const password = "newadmin";

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."}); 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Async function that wraps the operation
    async function myAsyncFunction() {
      // Simulating a condition with a boolean variable 'success'
      let success = true;
      // If the condition is true, resolve with a success message
      if (success) {
        //return ["output"];
        return books;
      } else {
        // If the condition is false, throw an error to simulate rejection
        throw new Error("The operation failed!");
      }
    }
    // Using async function to handle Promise
    async function executeAsyncFunction() {
      try {
        // Await the async function call to get the result
        const result = await myAsyncFunction();
        return result; // Output the result if successful
      } catch (error) {
        console.error(error.message); // Handle and output any errors
      }
    }
    // Call the async function to execute
    //executeAsyncFunction();
    (async () => {
	   return res.status(300).json({books: await executeAsyncFunction(), users: users});
	})()    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
	//console.log( require('util').inspect( req.params ) );
	//console.log( req.params );
	async function myAsyncFunction() { 
		return books[req.params.isbn]; 
	}
    	(async () => {
	   return res.status(300).json({books: await myAsyncFunction()});
	})()  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
	let author = req.params.author;
	// Filter the books array
	let booksby = Object.values(books).filter((eachbook) => {
	return eachbook.author === author;
	});
	console.log(booksby.length);
    	async function myAsyncFunction() { 
		return booksby; 
	}
    	(async () => {
	   return res.status(300).json({books: await myAsyncFunction()});
	})() 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    // Filter the books array
    let booksby = Object.values(books).filter((eachbook) => {
        return eachbook.title === title;
    });
    console.log(booksby.length);
    	async function myAsyncFunction() { 
		return booksby; 
	}
    	(async () => {
	   return res.status(300).json({books: await myAsyncFunction()});
	})() 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    return res.status(300).json({books:  books[req.params.isbn]["reviews"]});
});

module.exports.general = public_users;
