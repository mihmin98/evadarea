let body = document.getElementsByTagName("body")[0];

var xhr = new XMLHttpRequest();
var raspuns = null;
xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        raspuns = JSON.parse(xhr.response);
    } else {
        console.log("Ajax request fail", xhr.status);
    }
};

xhr.open("GET", "https://jsonplaceholder.typicode.com/users");
xhr.send();


let div = document.createElement("div");

div.innerHTML = "Email: ";
let emailInput = document.createElement("input");
emailInput.setAttribute("type", "email");
emailInput.setAttribute("id", "email-input");
emailInput.setAttribute("name", "email_input");
emailInput.setAttribute("value", "Sincere@april.biz");
div.appendChild(emailInput);

div.innerHTML += "<br>Password: ";
let passwordInput = document.createElement("input");
passwordInput.setAttribute("type", "password");
passwordInput.setAttribute("id", "password-input");
passwordInput.setAttribute("name", "password_input");
passwordInput.setAttribute("value", "1");

div.appendChild(passwordInput);

div.innerHTML += "<br><br>";
let loginBtn = document.createElement("button");
loginBtn.setAttribute("id", "login-button");
loginBtn.textContent = "Login";
div.appendChild(loginBtn);

div.innerHTML += "<br>";
let signUpBtn = document.createElement("a");
signUpBtn.textContent = "Sign Up";
signUpBtn.setAttribute("href", "/signup.html");
div.appendChild(signUpBtn);

body.appendChild(div);


loginBtn = document.getElementById("login-button");
loginBtn.addEventListener("click", login);

function login() {
    let email = emailInput.value;
    let password = passwordInput.value;

    let found = false;

    raspuns.forEach(function(element) {
        if (email == element.email && password == element.id) {
            found = true;
        }
    });

    if (found) {
        alert("Login Successful");
        window.localStorage.setItem("logged_in", JSON.stringify(true));
        let username = email.match(/.+?(?=@)/).toString(); // get email username until the @
        window.localStorage.setItem("username", username);
        window.location.href = "/index.html";
    } else {
        alert("Login Failed");
    }
}
