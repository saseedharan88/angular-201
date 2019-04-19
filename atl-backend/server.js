var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var https = require('https');
const GOOGLE_API = 'AIzaSyAEgLDMCrP3JuZxJSIwCZpyX6-1mJUooTQ';
var app = express()

var Book = require('./models/Book.js')
var User = require('./models/User.js')

var books = [
  { isbn: 'abcdef', book_name: 'Data structures' },
  { isbn: 'abcdef', book_name: 'Advanced C++' }
]

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('This is any time library..')
})

app.get('/books', (req, res) => {
  res.send(books)
})

app.get('/search-books',(req, res) => {
  var searchQuery = "";
  if (req.query.isbn != "") {
    searchQuery += "+isbn:"+req.query.isbn;
  }
  if (req.query.title != "") {
    searchQuery += "+intitle:"+req.query.title;
  }
  if (req.query.author != "") {
    searchQuery += "+inauthor:"+req.query.author;
  }

  https.get('https://www.googleapis.com/books/v1/volumes?q=' + searchQuery + '&maxResults=40&key=' + GOOGLE_API, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      res.send(data)
    });

  }).on("error", (err) => {
    res.send(err.message)
  });
})

// User register service.
app.post('/register', (req, res) => {
  var userData = req.body;

  var user = new User(userData);
  user.save((err, result) => {
    if (err)
      console.log("Error in registering a user."+err)
    res.sendStatus(200)
  })
  // res.sendStatus(200)
})

// Add Book service.
app.post('/addbook', (req, res) => {

  var bookData = req.body

  bookData.subject = [{
    name: "French fiction",
    description: "This is desc about French fiction.",
    isActive: true
  }]

  console.log("In adding a book."+bookData.isbn+" / "+bookData.book_name)
  // res.sendStatus(200)
  var book = new Book(bookData)
  book.save((err, result) => {
    if (err)
      console.log("Error in adding a book."+err)
    res.sendStatus(200)
  })
})


//Set up mongoose connection
var mongoDB = 'mongodb://atluser:jKiRsnG4rdvkFU0m@cluster0-shard-00-00-r9ag9.mongodb.net:27017,cluster0-shard-00-01-r9ag9.mongodb.net:27017,cluster0-shard-00-02-r9ag9.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
mongoose.connect(mongoDB, { useNewUrlParser: true }, (err) => {
  console.log('attenpt connected to mongo !!');
  if (!err)
    console.log('connected to mongo !!');
  console.log("err:"+err);
});
// mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(3000)
