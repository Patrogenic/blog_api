var BlogPost = require('../models/blog_post');
var Comment = require('../models/comment');
var User = require('../models/user');
var async = require('async');
var jwt = require("jsonwebtoken");
var bcrypt = require('bcryptjs');

const {body, validationResult} = require("express-validator");


//user will need to be logged in for post, put, and delete
exports.index_get = function(req, res){
    res.send('get request');
}
exports.index_post = function(req, res){

}
exports.index_put = function(req, res){
    res.send('put request');
}
exports.index_delete = function(req, res){
    res.send('delete request');
}

exports.login_get = function(req, res){
    res.send('get login page');
}

//next: follow validation procedure from that website https://dev.to/eidorianavi/authentication-and-jwt-in-node-js-4i13
exports.login_post = [
    body('username', 'Username required').trim().isLength({min: 1}).escape(),
    body('password', 'Password required').trim().isLength({min: 1}).escape(),

    async function(req, res, next){
        
        let user = await User.findOne({username: req.body.username});

        if(user !== null){
            let match = await bcrypt.compare(req.body.password, user.password);
            
            if(match){
                const token = jwt.sign({user}, process.env.TOKEN_SECRET, {expiresIn: '1d'});
                res.json({token});
            } else {
                res.json({ message: "Invalid Credentials" });
            }
        }else{
            res.json({ message: "Invalid Credentials" });
        }
    }
]
exports.make_account = [
    body('username', 'Username required').trim().isLength({min: 1}).escape(),
    body('password', 'Password required').trim().isLength({min: 1}).escape(),

    function(req, res, next){
        const errors = validationResult(req);

        let user = new User({
            username: req.body.username,
            password: req.body.password,
        });

        if(!errors.isEmpty()){
            //there are errors, do something
            console.log('validation errors- empty fields');
            res.json(errors)
        }else{
            //data from form is valid
            bcrypt.hash(user.password, 10, (err, hashedPassword) => {
                if(err){
                    //there is an error
                }
                user.password = hashedPassword;

                //Save to database
                user.save(function(err){
                    if(err){return next(err);}
                    res.redirect('/'); // redirect to home page
                })
            });
        }
    }

]

//get all blog posts
//I need to make it so I only get the posts that are published
exports.blog_posts_get = function(req, res){
    BlogPost.find({'published': true}).exec(function(err, blogPosts){
        res.json(blogPosts);
    })
}
exports.blog_posts_admin_get = function(req, res){
    jwt.verify(req.token, process.env.TOKEN_SECRET, function(err, authData){
        if(err){
            res.sendStatus(403);
        }else{
            BlogPost.find({}).exec(function(err, blogPosts){
                res.json(blogPosts);
            })
        }
    })
}

//nothing is served from the database so I'm not sure if I do anything here
exports.blog_posts_create_get = function(req, res){
    jwt.verify(req.token, process.env.TOKEN_SECRET, function(err, authData){
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                message: "Get successful",
                authData
            })
        }
    });
}

exports.blog_posts_create_post = [
    body('title', 'Title text required').trim().isLength({min: 1}).escape(),
    body('text', 'Post text required').trim().isLength({min: 1}).escape(),

    function(req, res, next){
        jwt.verify(req.token, process.env.TOKEN_SECRET, function(err, authData){
            if(err){
                res.sendStatus(403);
            }else{
                const errors = validationResult(req);
                var blogPost = new BlogPost({
                    title: req.body.title,
                    text: req.body.text,
                });
                if(!errors.isEmpty()){
                    res.json({
                        message: 'Validation errors, see errors arary',
                        errors: errors.array(),
                    })
                }else{
                    blogPost.save(function(err){
                        if(err){return next(err);}
                        // res.redirect('/admin' + blogPost.url);
                        res.json(blogPost); //return data to be displayed
                    })
                }
            }
        });
    }
]

//for the public
exports.blog_post_get = function(req, res, next){
    BlogPost.findById(req.params.id).exec(function(err, blogPost){
        if(err){return(err);}

        if(blogPost.published){
            Comment.find({'blog_post': req.params.id}).exec(function(err, comments){
                if(err){return next(err);}

                res.json({blogPost, comments})
            })

        }else{
            res.sendStatus(403);
        }
    })
}

exports.blog_post_admin_get = function(req, res, next){
    jwt.verify(req.token, process.env.TOKEN_SECRET, function(err, authData){
        if(err){
            res.sendStatus(403);
        }else{
            BlogPost.findById(req.params.id).exec(function(err, blogPost){
                if(err){return(err);}

                Comment.find({'blog_post': req.params.id}).exec(function(err, comments){
                    if(err){return next(err);}
    
                    res.json({blogPost, comments})
                })

            })
        }
    });
}


exports.blog_post_update_get = function(req, res){
    jwt.verify(req.token, process.env.TOKEN_SECRET, function(err, authData){
        if(err){
            res.sendStatus(403);
        }else{
            verify_token(req, res);
            BlogPost.findById(req.params.id).exec(function(err,blogPost){
                if(err){return next(err);}
                
                res.json(blogPost);
            })
        }
    });
}
exports.blog_post_update_put = [
    body('title', 'Title text required').trim().isLength({min: 1}).escape(),
    body('text', 'Post text required').trim().isLength({min: 1}).escape(),
    body('published', 'Published text required').trim().isLength({min: 1}).escape(),

    function(req, res, next){
        jwt.verify(req.token, process.env.TOKEN_SECRET, function(err, authData){
            if(err){
                res.sendStatus(403);
            }else{
                const errors = validationResult(req);
                var blogPost = {
                    title: req.body.title,
                    text: req.body.text,
                    published: req.body.published,
                };
                console.log(blogPost);
                if(!errors.isEmpty()){
                    res.json({
                        message: 'Validation errors, see errors arary',
                        errors: errors.array(),
                    })
                }else{
                    BlogPost.findByIdAndUpdate(req.params.id, blogPost, {}, function(err, theBlogPost){
                        if(err){return next(err);}
                        // res.redirect(theBlogPost.url);
                        res.json({message: 'success'})
                    })
                }
            }
        });
    }
]
exports.blog_post_delete_get = function(req, res){
    jwt.verify(req.token, process.env.TOKEN_SECRET, function(err, authData){
        if(err){
            res.sendStatus(403);
        }else{
            BlogPost.findById(req.params.id).exec(function(err,blogPost){
                if(err){return next(err);}
                
                res.json(blogPost);
            })
        }
    });
}

//I have to find all comments that reference the blog post, and then delete the blog post too
exports.blog_post_delete_delete = function(req, res){
    jwt.verify(req.token, process.env.TOKEN_SECRET, function(err, authData){
        if(err){
            res.sendStatus(403);
        }else{
            async.parallel({
                blogPost: function(callback){
                    BlogPost.findById(req.params.id).exec(callback);
                },
                comments: function(callback){
                    Comment.find({'blog_post': req.params.id}).exec(callback);
                },
            }, function(err, results){
                if(err){return next(err);}
                results.comments.forEach(comment => {
                    Comment.findByIdAndDelete(comment.id, function deleteComment(err){
                        if(err){return next(err);}
                    })
                });
                BlogPost.findByIdAndDelete(req.params.id, function deleteBlogPost(err){
                    if(err){return next(err);}
                    
                    // res.redirect('/blog_posts');
                    res.json({message: 'success'});
                })
            })
        }
    });
}

//FORMT OF TOKEN:
//Authorization: Bearer <access_token>
verify_token = function(req, res, next){
    //get auth header value
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        // split at the space
        const bearer = bearerHeader.split(' ');
        //get token from array
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
    
        console.log(bearerToken);
        next();
    }else{
        //forbidden
        res.sendStatus(403);
    }
}

exports.verify_token = verify_token;


//it might be worth refactoring at some point to use async and await a lot more