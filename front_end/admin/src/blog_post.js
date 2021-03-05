//call api to get a blog post by id
document.onload = submitCommentData();

function submitCommentData(){
    let name = getParam("name");
    let text = getParam("text");
    let id = getParam("id");
    console.log(id);
    if(name != '' && text != ''){
        document.getElementById('hidden-form-name').value = name;
        document.getElementById('hidden-form-text').value = text;
        // document.getElementById('hidden-form-id').value = id;

        let formEl = document.getElementById('hidden-comment-form');
        formEl.action = "http://localhost:3000/api/blog_post/" + id + "/add_comment";
        formEl.submit();
    }
    getBlogPost();
}
//we have this above solution which is good for when I want to go to another page
//however in this case we just want to stay on the same page
//and so I believe a lot of this is unnecessary
//alternatively I could submit the form on the page, save to the database, 
//and append the data to the comment section with no page refresh
//the issue with this is that there isn't as much of a confirmation of a successfully posted comment,
//and I'm not sure how I would check for that


//might need error checking
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