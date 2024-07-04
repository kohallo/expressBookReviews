const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let sameUsername = users.filter((user) => {
    return user.username === username;
  });

  if (sameUsername.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password) => { //returns boolean
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in."})
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in a session
    req.session.authorization = {
      accessToken, 
      username
    }
    return res.status(200).send("User successfully logged in.");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let filtered_book = books[isbn]
  if (filtered_book) {
    let review = req.query.review;
    let reviewer = req.session.authorization['username'];
    if(review) {
      filtered_book['reviews'][reviewer] = review;
      books[isbn] = filtered_book;
    }
    res.send(`The review for the book with the ISBN ${isbn} has been added or updated.`)
  }
  else {
    res.send("Unable to find the ISBN.")
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let reviewer = req.session.authorization['username'];
  let filtered_review = books[isbn]["reviews"];
  if (filtered_review[reviewer]) {
    delete filtered_review[reviewer];
    res.send(`The review for the ISBN ${isbn} posted by ${reviewer} has been deleted.`);
  }
  else {
    res.send("Can't delete review as it was posted by a different user.");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
