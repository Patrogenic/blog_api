var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema(
    {
        name: {type: String, required: true, maxlength: 100},
        text: {type: String, required: true, maxlength: 2000}, 
        time_stamp: {type: Date, default: Date.now},
        blog_post: {type: Schema.Types.ObjectId, ref: 'BlogPost', required: true}
    }
)

CommentSchema.virtual('url').get(function(){
    // return '/comment/' + this._id;
});

module.exports = mongoose.model('Comment', CommentSchema);