//call api to get a blog post by id

function submitComment(e){
    let name = document.getElementById('name-field').value;
    let text = document.getElementById('text-field').value;
    let id = getParam("id");
    e.preventDefault();

    console.log(id);

    fetch("http://blog.patrickcs.com/api/blog_post/" + id + "/add_comment", {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "name": name,
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
            window.location.href = 'blog_post.html?id=' + json.blog_post;
        }

    })
}  

//might need error checking
function getBlogPost(){
    let id = getParam("id");
    console.log("id " + id);
    fetch("http://blog.patrickcs.com/api/blog_post/" + id)
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
        let formEl = document.getElementById('comment-form');
        let inputEl = document.createElement('input');
        inputEl.type = "hidden";
        inputEl.name = "id";
        inputEl.id = "form-id";
        inputEl.value = json.blogPost._id;
        
        // formEl.action = "http://localhost:3000/blog_post/" + json.blogPost._id + "/add_comment";
        // formEl.action = "blog_post.html"
        formEl.appendChild(inputEl);

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

document.getElementById('comment-form').addEventListener('submit', submitComment);