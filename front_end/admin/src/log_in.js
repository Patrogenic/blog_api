function submitForm(e){
    let username = document.getElementById('username-field').value;
    let password = document.getElementById('password-field').value;
    e.preventDefault();

    fetch("http://blog.patrickcs.com/api/admin/log_in", {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": username,
            "password": password,
        })
    }).then(response => response.json())
    .then(json => {
        if(json.token !== undefined){
            //authentication!
            localStorage.setItem('user', JSON.stringify(json));
            window.location.href = 'blog_posts.html'; //redirect
        }else{
            console.log(json.message);
            document.getElementById('validation-errors').innerHTML = json.message;
        }
    })
}  

let loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', submitForm);

// console.log(document.getElementById('username-field').value);