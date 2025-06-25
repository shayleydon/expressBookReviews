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

Promise.timeout = function(promise, timeoutInMilliseconds){
//const promiseCb = function(promise, timeoutInMilliseconds){
    return Promise.race([
        new Promise(promise), 
        new Promise(function(resolve, reject){
            setTimeout(function() {
                reject("timeout");
            }, timeoutInMilliseconds);
        })
    ]);
};

const getBooksAsync = (req, res, solutionSwitch="default", solvedMethod)=>{ //returns boolean

	if (solutionSwitch == "ibm") {
		if (solvedMethod == "promiseCallback") {
			const get_books = new Promise((resolve, reject) => {
				resolve(res.send(JSON.stringify({books}, null, 4)));
			});
			get_books.then(() => console.log("Promise task 10 resolved"));
		} else if (solvedMethod == "asyncAwait") {
			(async () => {    
			    try{
				/*const data = await promiseCb(new Promise(function(resolve, reject){
					resolve(Object.values(books));
				}), 500);*/
				const data = await Promise.timeout((resolve) => {
					resolve(Object.values(books));
				}, 500);
				return res.status(200).json(data);
			    }catch(e){
				if(e == "timeout"){
				    console.log(e);
				}
				return res.status(500).json({message: e});
			    }
			})();
		} 
	} else if (solutionSwitch == "my") {
	    async function myAsyncFunction() {
	      if (books) {
		return books;
	      } else {
		// If the condition is false, throw an error to simulate rejection
		throw new Error("The operation failed!");
	      }
	    }
	    // Using async function to handle Promise
	    async function executeAsyncFunction() {
	      try {
		return await myAsyncFunction();
	      } catch (error) {
		console.error(error.message);
	      }
	    }
	    (async () => {
		   return res.status(300).json({books: await executeAsyncFunction(), users: users});
		})()  
	
	}else if (solutionSwitch == "peer") {
	
	}else {
		res.status(300).json({books: books, users: users});
	}
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
	let solvedByWho = ["default", "ibm","peer","my"];
  	let solvedMethod = ["asyncAwait", "promiseCallback"]
	getBooksAsync(req, res, solvedByWho[1], solvedMethod[0]);
	//getBooksAsync(req, res, solvedByWho[1], solvedMethod[1]);
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
