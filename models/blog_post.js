var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BlogPostSchema = new Schema(
    {
        title: {type: String, required: true, maxlength: 100},
        text: {type: String, required: true, maxlength: 50000}, //~10,000 word max?
        time_stamp: {type: Date, default: Date.now},
        published: {type: Boolean, required: true,  default: false}
    }
)

BlogPostSchema.virtual('url').get(function(){
    return '/blog_post/' + this._id;
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);