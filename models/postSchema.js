var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var postSchema = new Schema({
  title : String,
  author: { type: String, default: 'Ángel Casas Pescador' },
  body: String,
  preview: String,
  comments: { type: Array, default: [] },
  date: { type: Date, default: Date.now },
  cover: { contentType: String, data: Buffer },
  hidden: Boolean,
  tags: { type: Array, default: [] },
  meta: {
    votes: { type: Number, default: 0 },
    favs: { type: Number, default: 0 }
  },
  section: String
});

// Virtual for post's URL
postSchema.virtual('url').get(function() {
  return '/posts/' + this.section + '/' + this._id;
});

// Virtual for post's Time format
postSchema.virtual('post_time_formatted').get(function() {
  return moment(this.date).format('MMMM Do, YYYY');
});

// Virtual for post's tags list to String
postSchema.virtual('tag_list').get(function() {
  var string = new String;
  this.tags.forEach((tag) => {
    string += tag + ' ';
  });
  return string;
})

// Export model
module.exports = mongoose.model('Post', postSchema);
