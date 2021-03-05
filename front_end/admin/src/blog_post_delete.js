
function getBlogPost(){
    let id = getParam("id");
    console.log("id " + id);

    const localstorage_user = JSON.parse(localStorage.getItem('user'));
    const inMemoryToken = localstorage_user.token;

    fetch("http://localhost:3000/api/admin/blog_post/" + id, {
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + inMemoryToken,
        }
    })
    .then(function(response){
        if(response.status != 200){
            console.log(response.status);
            return;
        }else{
            return response.json();
        }
    }).then(function(json){
        console.log(json);
        let blogPostEl = document.getElementById('blog-post-container');
        let blogPostTitleEl = document.createElement('div');
        let blogPostTextEl = document.createElement('div');

        blogPostEl.classList.add('blog-post');
        blogPostTitleEl.classList.add('blog-post-title');
        blogPostTextEl.classList.add('blog-post-text');

        blogPostTitleEl.innerHTML = json.blogPost.title;
        blogPostTextEl.innerHTML = json.blogPost.text;

        blogPostEl.appendChild(blogPostTitleEl);
        blogPostEl.appendChild(blogPostTextEl);

        let commentsContainer = document.getElementById("comments-container");

        for (let i = 0; i < json.comments.length; i++) {
            let commentEl = document.createElement('div');
            let commentNameEl = document.createElement('div');
            let commentTextEl = document.createElement('div');

            commentNameEl.innerHTML = json.comments[i].name;
            commentTextEl.innerHTML = json.comments[i].text;

            commentEl.appendChild(commentNameEl);
            commentEl.appendChild(commentTextEl);

            commentsContainer.appendChild(commentEl);
        }
        
        // formEl.action = "http://localhost:3000/blog_post/" + json.blogPost._id + "/add_comment";
        // formEl.action = "blog_post.html"

    })
}



function deleteBlogPost(e){
    e.preventDefault();
    let id = getParam("id");
    console.log("id " + id);

    const localstorage_user = JSON.parse(localStorage.getItem('user'));
    const inMemoryToken = localstorage_user.token;

    fetch("http://localhost:3000/api/admin/blog_post/" + id, {
        method: 'delete',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + inMemoryToken,
        }
    })
    .then(function(response){
        if(response.status != 200){
            console.log(response.status);
            return;
        }else{
            return response.json();
        }
    }).then(function(json){
        console.log(json.message); //success

        if(json.message.localeCompare('success') === 0){
            window.location.href = "blog_posts.html";
        }else{
            console.log('not successful');

        }

    })
}


//get parameter by name from url
function getParam(name)
{
  let start=location.search.indexOf("?"+name+"=");
  if (start<0){
      start=location.search.indexOf("&"+name+"=");
  }
  if (start<0){
      return '';
  }
  start += name.length+2;
  let end=location.search.indexOf("&",start)-1;
  if (end<0){
      end=location.search.length;
  }
  let result='';
  for(let i=start;i<=end;i++) {
    let c=location.search.charAt(i);
    result=result+(c=='+'?' ':c);
  }
  return unescape(result);
}

getBlogPost();

document.getElementById('delete-form').addEventListener('submit', deleteBlogPost);



