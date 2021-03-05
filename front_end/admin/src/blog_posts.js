
async function getBlogPostData(){
    const localstorage_user = JSON.parse(localStorage.getItem('user'));
    const inMemoryToken = localstorage_user.token;

    return (fetch("http://localhost:3000/api/admin/blog_posts", {
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + inMemoryToken,
        }
    }).then(res => {
        // console.log(res);
        return res.json()
    }).then(json => {
            console.log(json);
            
        return json;
    }))
}

//data enters the function as an array of blog post objects
function displayBlogPostData(data){

    let mainContent = document.getElementById('main-content');

    for (let i = 0; i < data.length; i++) {
        let blogPreviewContainer = makeElement('div', 'blog-post-preview', '');

        blogPreviewContainer.appendChild(makeForm(data[i]._id, data[i].title + (data[i].published ? ' (published)' : ' (not published)'), 'blog_post.html', 'blog-post-preview-title'));
        blogPreviewContainer.appendChild(makeElement('div', 'blog-post-preview-text', data[i].text));

        let optionsEl = makeElement('div', 'TODOstyleclaas', '');
        optionsEl.appendChild(makeForm(data[i]._id, 'Edit', 'blog_post_edit.html', 'TODOstyleclass'));
        optionsEl.appendChild(makeForm(data[i]._id, 'Delete', 'blog_post_delete.html', 'TODOstyleclass'));

        blogPreviewContainer.appendChild(optionsEl);
        mainContent.appendChild(blogPreviewContainer);
    }
}
function makeElement(name, styleClass, text, type = null){
    let element = document.createElement(name);
    element.classList.add(styleClass);
    element.innerHTML = text;
    if(type !== null){
        element.type = type;
    }
    return element;
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

async function getDataAndDisplayBlogPosts(){
    let data = await getBlogPostData();
    displayBlogPostData(data);
}

getDataAndDisplayBlogPosts();