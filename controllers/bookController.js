var books = require('../models/bookSchema');

// Display list of all book items.
exports.books_list = function(req, res) {
  res.render('books');
};

// Handle book create on GET.
exports.books_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Books create');
};

exports.books_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Books post');
}
