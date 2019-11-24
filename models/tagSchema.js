var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var tagSchema = new Schema({
  _id: String,
  post: [{type: Schema.Types.ObjectId, ref: 'Post'}]
});


// Virtual for tag's URL
tagSchema.virtual('url').get(function() {
  return '/posts/find/' + this.tagName.replace(' ', '_');
});

// Export model
module.exports = mongoose.model('Tag', tagSchema);
