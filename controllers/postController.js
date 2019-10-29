var Blog = require('../models/postSchema');
var Books = require('../models/bookSchema');
var mongoose = require('mongoose');

const { check, validationResult } = require('express-validator/check');

var debug = require('debug')('posts');


var async = require('async');

exports.index = function(req, res) {
  // GET RANDOM POST
  Blog.countDocuments().exec(function (err, count) {

    // Get a random entry
    var random = Math.floor(Math.random() * count)

    // Again query all posts but only fetch one offset by our random #
    Blog.findOne().skip(random).exec(
      function (err, result) {
        if (err) {
          debug('find index error:' + err);
          return next(err);
        }
        // On success
        res.render('index', {title: 'Welcome', post: result});
      });
  });
};

// Display list of all Posts
exports.post_list = function (req, res, next) {
  Blog.find({})
    .exec(function(err, list_posts) {
      if (err) {
        debug('find post list error:' + err);
        return next(err);
      }
      // On success
      res.render('post_list', {title: 'Recent Blog Posts', post_list: list_posts});
    });
};

// Display list of all posts in section
exports.post_section_list = function (req, res, next) {
  Blog.find({section: req.params.section}, function(err, list_section_posts) {
    if (err) {
      debug('find post section list error:' + err);
      return next(err);
    }
    // On success
    res.render('post_list', {title: req.params.section.toUpperCase() == "ML" ? 'MACHINE LEARNING' : req.params.section.toUpperCase(), post_list: list_section_posts});
  });
}

// Display list of all posts in specified tag
exports.post_tag_list = function (req, res, next) {
  Blog.find({tags: req.params.tag}, function(err, list_tag_posts) {
    if (err) {
      debug('find post tag list error:' + err);
      return next(err);
    }
    // On success
    res.render('tag_list', {tag: req.params.tag, post_list: list_tag_posts});
  });
}

// Display post instance
exports.post_instance = function(req, res, next) {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    debug('Valid Id');
    Blog.findById(req.params.id, function (err, post) {
      if (err) {
        debug('findById post instance error:' + err);
        return next(err);
      }
      // On success
      res.render('post', {title: post.title, post: post});
    });
  } else {
    debug('Invalid Id');
    res.render('error');
  }
}

// Display post instance cover image
exports.post_cover = function(req, res, next) {
  Blog.findById(req.params.id, function (err, post) {
    if (err) {
      debug('findById post cover error:' + err);
      return next(err);
    }
    // On success
    res.contentType(post.cover.contentType);
    res.send(post.cover.data);
  });
}

// Display post comment on GET
exports.post_comment_get = function(req, res) {
  res.send('NOT IMPLEMENTED: GET comment');
}

// Handle post comment on POST
exports.post_comment_post = function(req, res, next) {
  // Validation and Sanitation for POST form request

  check('content').isLength({ min: 1})

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    debug('post comment error:' + errors);
    return res.status(422).json({ errors: errors.array() });
  }

  // Find post and add new comment

  Blog.findById(req.params.id, function(err, post) {
    if (err) {
      debug('findById post comment error:' + err);
      return next(err);
    }
    // On success
    post.comments.push({
      name: req.body.name ? req.body.name : 'Anonymous',
      content: req.body.content,
      date: new Date()
    })
    post.save(function (err) {
      if (err) {
        debug('post comment save error:' + err);
        next(err, null);
        return;
      }
      debug('Successfully created comment and saved: ' + post.comments[post.comments.length-1]);
      res.redirect('/posts/'+req.params.section+'/'+req.params.id+'#blog-comments');

    });
  });
}

// Display post like on POST
exports.post_like_post = function(req, res, next) {
  Blog.findById(req.params.id, function (err, post) {
    if (err) {
      debug('post like error:' + err);
      return next(err)
    }
    // On success
    post.meta.votes += 1;
    post.save(function (err) {
      if (err) {
        debug('post like save error:' + err);
        next(err, null);
        return;
      }
      res.redirect('/posts/'+req.params.section+'/'+req.params.id+'#entry');
    });
  })
}

// handle create post on GET
exports.post_create_get = function(req, res) {
  res.render('createPost');
}

// handle create post on POST
exports.post_create_post = function(req, res, next) {
  Blog.findOne({title: req.body.title}, function(err, post) {
    if (err) {
      debug('post create error:' + err);
      return next(err);
    }
    if (post) {
      // Already a post with that title
      res.send('POST title already in db: ' + post);
    } else {
      let tags = [];
      debug('Attempting to create new post');
      debug(req.body);
      for (var tag of req.body.tags.split(' ')) {
        tags.push(tag);
      }
      let postdetail = {
        title: req.body.title,
        body: req.body.content,
        preview: req.body.preview,
        tags: tags,
        section: req.body.section
      };

      var post = new Blog(postdetail);


      post.save(function (err) {
        if (err) {
          debug('post create save error:' + err);
          next(err, null);
          return;
        }
        // On success
        debug('New Post: ' + post);
        res.redirect('/');
      });
    }
  });
}

// Handle post update on POST
exports.post_update_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED: POST update');
};
