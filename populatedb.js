#! /usr/bin/env node

console.log('This script populates some test posts and books to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Book = require('./models/bookSchema')
var Post = require('./models/postSchema')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose.connect(mongoDB, option).then(function() {
  console.log('Successfully connected to database');
  async.series([
      createPosts
  ],
  // Optional callback
  function(err, results) {
      if (err) {
          console.log('FINAL ERR: '+err);
      }
      else {
          console.log('Posts: '+posts);

      }
      // All done, disconnect from database
      console.error('closing db connection');
      mongoose.connection.close();
  });
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var posts = []
var books = []

function postCreate(title, content, section, cb) {
  postdetail = {title: title, body: content, section: section};

  var post = new Post(postdetail);


  post.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Post: ' + post);
    posts.push(post)
    cb(null, post)
  }  );
}

function bookCreate(title, summary, isbn, author, genre, cb) {
  bookdetail = {
    title: title,
    summary: summary,
    author: author,
    isbn: isbn
  }

  var book = new Book(bookdetail);
  book.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Book: ' + book);
    books.push(book)
    cb(null, book)
  }  );
}


function createPosts(cb) {
    async.series([
        function(callback) {
          postCreate('Neural Machine Translation', 'Learn more here', 'ml', callback);
        },
        function(callback) {
          postCreate('ML', 'Exciting Article coming', 'bitcoin', callback);
        }
        ],
        // optional callback
        cb);
}


function createBooks(cb) {
    async.parallel([
        function(callback) {
          bookCreate('The Name of the Wind (The Kingkiller Chronicle, #1)', 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', '9781473211896', posts[0], 'Fantasy', callback);
        },
        function(callback) {
          bookCreate("The Wise Man's Fear (The Kingkiller Chronicle, #2)", 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', '9788401352836', posts[0], 'Sci-fi', callback);
        }
        ],
        // optional callback
        cb);
}
