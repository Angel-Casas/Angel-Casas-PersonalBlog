var Blog = require('../models/postSchema');
var Books = require('../models/bookSchema');
var Tag = require('../models/tagSchema');
var mongoose = require('mongoose');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var debug = require('debug')('posts');


var async = require('async');

exports.index = function(req, res) {
  // GET RANDOM POST
  Blog.countDocuments().exec(function (err, count) {

    // Get a random entry
    var random = Math.floor(Math.random() * count)

    async.parallel({
      // Again query all posts but only fetch one offset by our random #
      post: function(callback) {
        Blog.findOne().
          skip(random).
          populate('tags').
          exec(callback);
      },
      // Find all tags for display in Index page
      tags: function(callback) {
        Tag.find({}).
          populate({
            path: 'post',
            populate: {
              path: 'tags',
              model: 'Tag'
            }
          }).
          exec(callback);
      }
    }, function(err, results) {
      if (err) { return next(err); }
      // Successful so render
      res.render('index', {title: 'Welcome', post: results.post, tag_list: results.tags});
    });
  });
};

// Display list of all Posts
exports.post_list = function (req, res, next) {
  Blog.find({}).
    populate('tags').
    exec(function(err, list_posts) {
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
Blog.find({section: req.params.section}).
  populate('tags').
  exec(function(err, list_section_posts) {
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
  Tag.findById(req.params.tag).
    populate({
      path: 'post',
      populate: {
        path: 'tags',
        model: 'Tag'
      }
    }).
    exec(function(err, tag_list) {
      if (err) {
        debug('find post tag list error:' + err);
        return next(err);
      }
      // On success
      console.log(tag_list.post.length);
      res.render('tag_list', { title: req.params.tag, tag_list: tag_list, posts: tag_list.post });
    });
}

// Display post instance
exports.post_instance = function(req, res, next) {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    debug('Valid Id');
    Blog.findById(req.params.id).
      populate('tags').
      exec(function (err, post) {
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

  body('content').isLength({ min: 1})

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
exports.post_create_post = [

  // Validate fields
  body('title').isLength({ min: 1 }).trim().withMessage('Title must be specified.'),
  body('content').isLength({ min: 1 }).trim().withMessage('Content must be specified.'),
  body('preview').optional().isLength({ min: 1 }).trim().withMessage('Preview must be specified.'),
  body('tags').optional().isLength({ min: 1 }).trim().withMessage('Tags must be specified'),

  // Sanitize fields
  sanitizeBody('title').escape(),
  sanitizeBody('preview').escape(),

  // Process request after validation and sanitation.
  async (req, res, next) => {
    console.log('Attempting to create new post');
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render('createPost', { errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid.

      // Create post object with escaped and trimmed data.
      var post = new Blog(
        {
          title: req.body.title,
          body: req.body.content,
          preview: req.body.preview,
          section: req.body.section
        });
      // Create tags object and save to db.
      var tags = req.body.tags.split(' ');
      for (let i = 0; i < tags.length; i++) {
        const tagname = tags[i];
        const existingTag = await Tag.findById(tagname);
        if (!existingTag) {
          console.log('New tag found!');
          var tag = await new Tag({
            _id: tagname,
            post: post._id
          }).save();
          post.tags.push(tag);
        } else {
          Tag.findById(tagname).
            populate({
              path: 'post',
              select: 'tags',
              populate: {
                path: 'tags',
                model: 'Tag'
              }
            }).
            exec(function (err, tag) {
            if (err) {
              debug('find id error:' + err);
              return next(err);
            }
            // On success
            console.log('Old tag found!');
            tag.post.push(post);
            post.tags.push(tag);
            tag.save(function (err) {
              if (err) {
                debug('update tag posts error:' + err);
                next(err, null);
                return;
              }
              console.log("updated tag posts: " + tag.post);
              debug('Successfully updated tag posts');
            });
          });
        }
      }

      // Save post object to db.
      await post.save(function(err) {
        if (err) { return next(err); }
        // Successful so redirect to new post
        console.log('New Post: ' + post);
        res.redirect('/');
      });
    }
  }
];


// Handle post update on POST
exports.post_update_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED: POST update');
};

// Handle about section on GET
exports.about_section_get = function (req, res, next) {
  res.render('about');
}

// Handle projects section on GET
exports.projects_section_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED: GET projects');
}
