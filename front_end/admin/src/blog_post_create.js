function submitBlogPost(e){
    let title = document.getElementById('title-field').value;
    let text = document.getElementById('text-field').value;
    e.preventDefault();

    const localstorage_user = JSON.parse(localStorage.getItem('user'));
    const inMemoryToken = localstorage_user.token;

    fetch("http://localhost:3000/api/admin/blog_post/create", {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + inMemoryToken,
        },
        body: JSON.stringify({
            "title": title,
            "text": text,
        })
    }).then(response => {
        console.log(response);
        return response.json();
    }).then(json => {
        console.log(json);
        //if there are errors, notify admin
        if(/*json equals errors */false){

        }else{
            window.location.href = 'blog_post.html?id=' + json._id;
            //  if this doesn't work, then we have to submit a form like how we do navigating
            //  to blogs from the home page
        }

        //else the data has been added to the database and we can redirect to /blog_post/id and
        //have the new id as a parameter in the url
        //on /blog_post/id, we will do a get request with the id we have

    })
}  

let createBlogPostForm = document.getElementById('create-blog-post-form');
createBlogPostForm.addEventListener('submit', submitBlogPost);