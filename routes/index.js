var express = require('express');
var router = express.Router();
var blogPostController = require('../controllers/blogPostController');
var commentController = require('../controllers/commentController');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//the home page might actually do nothing for this application, for the api anyway
router.get('/', blogPostController.index_get);
router.post('/', blogPostController.index_post);
router.put('/', blogPostController.index_put);
router.delete('/', blogPostController.index_delete);

//get login page
router.get('/admin/log_in', blogPostController.login_get);
//authenticate user information (only user is admin, which is me)
router.post('/admin/log_in', blogPostController.login_post);


//this will take you to a page to create a comment for a specific post
router.get('/blog_post/:id/add_comment', commentController.comments_get);
//this will submit the comment and add it to the database
router.post('/blog_post/:id/add_comment', commentController.comments_post);

//this page will differ from the blog post page in that on this single page a PUT and a DELETE request will be possible
router.get('/admin/blog_post/comment/:id', blogPostController.verify_token, commentController.comment_get);
//update a specific comment (probably have to get a specific comment) (include links for admin on each comment)
router.put('/admin/blog_post/comment/:id', blogPostController.verify_token, commentController.comment_put);
//delete a specific comment
router.delete('/admin/blog_post/comment/:id', blogPostController.verify_token, commentController.comment_delete);

//show all blog posts
router.get('/blog_posts', blogPostController.blog_posts_get);


router.get('/admin/blog_posts', blogPostController.verify_token, blogPostController.blog_posts_admin_get);

//create blog post
router.get('/admin/blog_post/create', blogPostController.verify_token, blogPostController.blog_posts_create_get);
//submit blog post to database
router.post('/admin/blog_post/create', blogPostController.verify_token, blogPostController.blog_posts_create_post);

//get one blog post-- I will have to check to see if the post is published, if it is not, I will then have to check for authentication
router.get('/blog_post/:id', blogPostController.blog_post_get);

//this is for the admin to make modifications to the data on the site
router.get('/admin/blog_post/:id', blogPostController.verify_token, blogPostController.blog_post_admin_get);

//get the update blog post page
// router.get('/blog_post/:id', blogPostController.verify_token, blogPostController.blog_post_update_get)
//update a specific blog post
router.put('/admin/blog_post/:id', blogPostController.verify_token, blogPostController.blog_post_update_put);

//get the delete blog post page
// router.get('/blog_post/:id', blogPostController.verify_token, blogPostController.blog_post_delete_get);
//delete a specific blog post
router.delete('/admin/blog_post/:id', blogPostController.verify_token, blogPostController.blog_post_delete_delete);


// router.post('/admin/make_account', blogPostController.make_account);

module.exports = router;


//I need to include a jwt.verify function in every function that requires verifcation
//Actually no I don't in this application because someone is either logged and that's my account, or they are not logged in and the token is undefined
//Although when they make the api call they could have a token that is not undefined and then they would have full access to the web application
//So I need to include jwt.verify everywhere