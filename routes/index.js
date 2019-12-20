var express = require('express');
var router = express.Router();

// Require controller modules
var postController = require('../controllers/postController');
var bookController = require('../controllers/bookController');

// Home page route.
router.get('/', postController.index);
router.get('/:lang', postController.index);

// About page route
router.get('/:lang/about', postController.about_section_get);

// Projects page route
router.get('/:lang/projects', postController.projects_section_get);

// POST ROUTES

// GET request for posts list landing page
router.get('/posts', postController.post_list);

// GET request for post section landing page
router.get('/:lang/posts/:section', postController.post_section_list);

// GET request for post tags landing page
router.get('/:lang/posts/find/:tag', postController.post_tag_list);

// GET request for post instance
router.get('/:lang/posts/:section/:id', postController.post_instance);

// GET request for post instance cover
router.get('/posts/:section/:id/img', postController.post_cover);

// GET request for post comment
router.get('/posts/:section/:id/comment', postController.post_comment_get);

// POST request for post comment
router.post('/posts/:section/:id/comment', postController.post_comment_post);

// GET request for like comment
router.post('/posts/:section/:id/like', postController.post_like_post);

// GET request for creating post PRIVATE
router.get('/:lang/new', postController.post_create_get);

// POST request for creating post PRIVATE
router.post('/:lang/new', postController.post_create_post);

// GET request for editing post PRIVATE
router.get('/:lang/posts/:section/:id/edit', postController.post_edit_get);

// POST request for editing post PRIVATE
router.post('/:lang/posts/:section/:id/edit', postController.post_edit_post);

// GET request for deleting post PRIVATE
router.get('/:lang/posts/:section/:id/delete', postController.post_delete_get);

// POST request for deleting post PRIVATE
router.post('/:lang/posts/:section/:id/delete', postController.post_delete_post);

// BOOKS ROUTES

// GET request for books list landing page
router.get('/:lang/books', bookController.books_list);

// GET request for books create
router.get('/books/create', bookController.books_create_get);

// POST request for books create
router.post('/books/create', bookController.books_create_post);

module.exports = router;
