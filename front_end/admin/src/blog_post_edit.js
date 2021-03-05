function getBlogPost(){
    let id = getParam("id");
    console.log("id " + id);

    const localstorage_user = JSON.parse(localStorage.getItem('user'));
    const inMemoryToken = localstorage_user.token;

    fetch("http://localhost:3000/admin/blog_post/" + id, {
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
        let blogPostTitleEl = document.createElement('input');
        let blogPostTextEl = document.createElement('textarea');
        let blogPostPublishedEl = document.getElementById('published-status');

        blogPostEl.classList.add('blog-post');

        blogPostTitleEl.classList.add('blog-post-title');
        blogPostTitleEl.type = "text";
        blogPostTitleEl.name = "title";
        blogPostTitleEl.style.display = "block";
        blogPostTitleEl.style.margin = "0 auto";
        blogPostTitleEl.id = 'blog-post-title';

        blogPostTextEl.classList.add('blog-post-text');
        blogPostTextEl.style.width = "855px";
        blogPostTextEl.style.height = "200px";
        blogPostTextEl.name = "text";
        blogPostTextEl.id = 'blog-post-text';

        if(!json.blogPost.published){
            document.getElementById('not-published-option').selected = 'selected';
        }

        blogPostTitleEl.value = json.blogPost.title;
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
            commentEl.appendChild(makeForm(json.comments[i]._id, 'Delete', 'comment_delete.html', 'TODOstyleclass'));

            commentsContainer.appendChild(commentEl);
        }
        
        // formEl.action = "http://localhost:3000/blog_post/" + json.blogPost._id + "/add_comment";
        // formEl.action = "blog_post.html"

    })
}

function editBlogPost(e){
    e.preventDefault();
    let id = getParam("id");
    let title = document.getElementById('blog-post-title').value;
    let text = document.getElementById('blog-post-text').value;
    let published = document.getElementById('published-status').value;
    console.log("id " + id);

    const localstorage_user = JSON.parse(localStorage.getItem('user'));
    const inMemoryToken = localstorage_user.token;

    fetch("http://localhost:3000/admin/blog_post/" + id, {
        method: 'put',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + inMemoryToken,
        },
        body: JSON.stringify({title, text, published}),
    })
    .then(function(response){
        if(response.status != 200){
            console.log(response.status);
            console.log(response);
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

function makeForm(id, text, action, styleClass){
    let form = document.createElement('form');
    form.action = action;
    form.style.display = "inline-block"; //add to style class in the future

    let inputEl = document.createElement('input');
    inputEl.type = "hidden";
    inputEl.name = "id";
    inputEl.value = id;

    let button = document.createElement('button');
    button.type = 'submit';
    button.innerHTML = text;
    button.classList.add(styleClass);

    form.appendChild(inputEl);
    form.appendChild(button);

    return form;
}

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


document.getElementById('edit-form').addEventListener('submit', editBlogPost);
