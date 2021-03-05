//call api to get blog posts

function getBlogPosts(){

    fetch("http://localhost:3000/blog_posts")
        .then(function(response){
            return response.json();
        }).then(function(json){
            //display json data
            console.log(json);

            let mainContent = document.getElementById('main-content');

            //I think I have to add links to each post
            for (let i = 0; i < json.length; i++) {
                let blogPreviewEl = document.createElement('div');
                let blogPreviewTitleEl = document.createElement('button');
                let blogPreviewTextEl = document.createElement('div');

                let formEl = document.createElement('form');
                let inputEl = document.createElement('input');
                inputEl.type = "hidden";
                inputEl.name = "id";
                inputEl.value = json[i]._id;
                
                formEl.action = "blog_post.html";
                formEl.appendChild(inputEl);

                blogPreviewEl.classList.add('blog-post-preview');
                blogPreviewTitleEl.classList.add('blog-post-preview-title');
                blogPreviewTextEl.classList.add('blog-post-preview-text');

                blogPreviewTitleEl.innerHTML = json[i].title;
                blogPreviewTextEl.innerHTML = json[i].text;

                blogPreviewTitleEl.type = "submit";
                blogPreviewTitleEl.style.cursor = "pointer";
                
                formEl.appendChild(blogPreviewTitleEl);
                blogPreviewEl.appendChild(formEl);
                blogPreviewEl.appendChild(blogPreviewTextEl);

                // blogPreviewEl.addEventListener('click', formEl.submit);

                mainContent.appendChild(blogPreviewEl);
            }

        })


}
getBlogPosts();