var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()

var Book = require('./models/Book.js')

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

// User register service.
app.post('/register', (req, res) => {
  var userData = req.body;
  console.log(userData.name);
  console.log(userData.password);
  res.sendStatus(200)
})

// Add Book service.
app.post('/addbook', (req, res) => {

  var bookData = req.body
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
