function getComment(){
    let id = getParam("id");
    console.log("id " + id);

    const localstorage_user = JSON.parse(localStorage.getItem('user'));
    const inMemoryToken = localstorage_user.token;

    fetch("http://localhost:3000/api/admin/blog_post/comment/" + id, {
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
        let commentEl = document.getElementById('comment-container');
        let commentNameEl = document.createElement('div');
        let commentTextEl = document.createElement('div');
        // let timeEl = document.createElement('div');

        commentNameEl.innerHTML = json.name;
        commentTextEl.innerHTML = json.text;
        // commentTextEl.innerHTML = json.time_stamp;

        commentEl.appendChild(commentNameEl);
        commentEl.appendChild(commentTextEl);
        
        // formEl.action = "http://localhost:3000/blog_post/" + json.blogPost._id + "/add_comment";
        // formEl.action = "blog_post.html"

    })
}

function deleteComment(e){
    e.preventDefault();
    let id = getParam("id");
    console.log("id " + id);

    const localstorage_user = JSON.parse(localStorage.getItem('user'));
    const inMemoryToken = localstorage_user.token;

    fetch("http://localhost:3000/api/admin/blog_post/comment/" + id, {
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
        console.log(json.blog_post); //success

        window.location.href = "blog_post_edit.html?id=" + json.blog_post;


    })
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

getComment();

document.getElementById('delete-form').addEventListener('submit', deleteComment);