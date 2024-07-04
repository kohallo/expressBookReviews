const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username, "password":password});
      return res.status(200).json({message: "User has successfully registered. You can now log in."});
    } else {
      return res.status(404).json({message: "Username already taken."});
    }
  }
  return res.status(404).json({message: "Unable to register user please fill in both fields."});
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  res.send(JSON.stringify({books},null,4));
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  res.send(books[isbn]);

  // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  let bookAuthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
      bookAuthor.push({
        "isbn":isbn,
        "author":books[isbn]["author"],
        "title":books[isbn]["title"],
        "reviews":books[isbn]["reviews"]
      });
    }
  });
  res.send(JSON.stringify({ bookAuthor }, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  let bookTitle = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["title"] === req.params.title) {
      bookTitle.push({
        "isbn":isbn,
        "author":books[isbn]["author"],
        "reviews":books[isbn]["reviews"]
      });
    }
  });
  res.send(JSON.stringify({bookTitle}, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"]);
});

// Get book list
public_users.get('/books', (req, res) => {
  const get_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({books}, null, 4)));
  });
  get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// Get books by ISBN
public_users.get('/books/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const get_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify(books[isbn], null, 4)));
  });
  get_books.then(() => console.log("Promise for Task 11 resolved"));
});

// Get books by Author
public_users.get('/books/author/:author', (req, res) => {
  const get_books_author = new Promise((resolve, reject) => {
    let bookAuthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        bookAuthor.push({
          "isbn":isbn,
          "author":books[isbn]["author"],
          "title":books[isbn]["title"],
          "reviews":books[isbn]["reviews"]
        });
        resolve(res.send(JSON.stringify({ bookAuthor }, null, 4)));
      }
    });
    reject(res.send("Author doesn't exist."));
  });
  get_books_author.then(() => {
    console.log("Promise for tast 12 resolved");
  }).catch(() => {
    console.log("Author doesn't exist.");
  });
});

// Get all books based on title
public_users.get('/books/title/:title', (req, res) => {
  const get_books_title = new Promise((resolve, reject) => {
    let bookTitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        bookTitle.push({
          "isbns":isbn,
          "author":books[isbn]["author"],
          "title":books[isbn]["title"],
          "reviews":books[isbn]["reviews"]
        });
        resolve(res.send(JSON.stringify({ bookTitle }, null, 4)));
      }
    });
  });
});

module.exports.general = public_users;
