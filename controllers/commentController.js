var BlogPost = require('../models/blog_post');
var Comment = require('../models/comment');
var jwt = require("jsonwebtoken");
const {body, validationResult} = require("express-validator");

//user will need to be logged in for put and delete
//random people will be able to use post to add comments

//this might do nothing- a static page with a form will be served- no authentication required
exports.comments_get = function(req, res){
    res.send('comment get request');
}


exports.comments_post = [
    body('name', 'Name text required').trim().isLength({min: 1}).escape(),
    body('text', 'Comment text required').trim().isLength({min: 1}).escape(),

    function(req, res, next){
        const errors = validationResult(req);
        var comment = new Comment({
            name: req.body.name,
            text: req.body.text,
            blog_post: req.params.id,
        });

        if(!errors.isEmpty()){
            res.json({
                message: 'Validation errors, see errors arary',
                errors: errors.array(),
            })
        }else{
            comment.save(function(err){
                if(err){return next(err);}
                // res.status(204).send(); //no content response
                res.json(comment);
            })
        }
    }

]
exports.comment_get = function(req, res){
    jwt.verify(req.token, process.env.TOKEN_SECRET, function(err, authData){
        if(err){
            res.sendStatus(403);
        }else{
            Comment.findById(req.params.id).exec(function(err, comment){
                if(err){return (err);}
                res.json(comment);
            })
        }
    });
}

exports.comment_put = [
    body('name', 'Name text required').trim().isLength({min: 1}).escape(),
    body('text', 'Comment text required').trim().isLength({min: 1}).escape(),

    function(req, res, next){
        jwt.verify(req.token, process.env.TOKEN_SECRET, function(err, authData){
            if(err){
                res.sendStatus(403);
            }else{
                const errors = validationResult(req);
                let comment = {
                    name: req.body.name,
                    text: req.body.text,
                }

                if(!errors.isEmpty()){
                    res.json({
                        message: 'Validation errors, see errors arary',
                        errors: errors.array(),
                    })
                }else{
                    Comment.findByIdAndUpdate(req.params.id, comment, {}, function(err, theComment){
                        if(err){return next(err);}
                        //redirect to the blog post that has this comment
                        console.log("Comment: " + theComment);
                        res.redirect('/blog_post/' + theComment.blog_post);
                    })
                }
            }
        });
    }
]
exports.comment_delete = function(req, res){
    jwt.verify(req.token, process.env.TOKEN_SECRET, function(err, authData){
        if(err){
            res.sendStatus(403);
        }else{
            Comment.findByIdAndDelete(req.params.id, function deleteComment(err, comment){
                if(err){return next(err);}
                //redirect to the blog post that has this comment
                res.json({blog_post: comment.blog_post})
                // res.redirect('/blog_post/' + comment.blog_post);
            })
        }
    });
}