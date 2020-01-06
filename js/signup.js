let body = document.getElementsByTagName("body")[0];

let div = document.createElement("div");

div.innerHTML = "Username: ";
let textInput = document.createElement("input");
textInput.setAttribute("type", "text");
textInput.setAttribute("id", "username-input");
div.appendChild(textInput);

div.innerHTML += "<br>Email: ";
let emailInput = document.createElement("input");
emailInput.setAttribute("type", "email");
emailInput.setAttribute("id", "email-input");
div.appendChild(emailInput);

div.innerHTML += "<br>Password: ";
let passwordInput = document.createElement("input");
passwordInput.setAttribute("type", "password");
passwordInput.setAttribute("id", "password-input");
div.appendChild(passwordInput);

div.innerHTML += "<br>Gender: ";
let selectInput = document.createElement("select");
let option = document.createElement("option");
option.setAttribute("value", "male");
option.textContent = "Male";
selectInput.appendChild(option);
option = document.createElement("option");
option.setAttribute("value", "female");
option.textContent = "Female";
selectInput.appendChild(option);
div.appendChild(selectInput);

div.innerHTML += "<br>Hatz: ";
let checkboxInput = document.createElement("input");
checkboxInput.setAttribute("type", "checkbox");
checkboxInput.setAttribute("value", "hatz");
div.appendChild(checkboxInput);

div.innerHTML += "<br>Age: ";
let radioInput1 = document.createElement("input");
radioInput1.setAttribute("type", "radio");
radioInput1.setAttribute("name", "age");
radioInput1.setAttribute("value", "under_18");
radioInput1.setAttribute("id", "radio-1-input");
div.appendChild(radioInput1);
div.innerHTML += "<18<br>";

let radioInput2 = document.createElement("input");
radioInput2.setAttribute("type", "radio");
radioInput2.setAttribute("name", "age");
radioInput2.setAttribute("value", "18_35");
radioInput2.setAttribute("id", "radio-2-input");
div.appendChild(radioInput2);
div.innerHTML += "18 - 35<br>";

let radioInput3 = document.createElement("input");
radioInput3.setAttribute("type", "radio");
radioInput3.setAttribute("name", "age");
radioInput3.setAttribute("value", "over_35");
radioInput3.setAttribute("id", "radio-3-input");
div.appendChild(radioInput3);
div.innerHTML += ">35<br><br>";

div.innerHTML += "How much do you like Dani Mocanu?<br>";
let rangeInput = document.createElement("input");
rangeInput.setAttribute("type", "range");
rangeInput.setAttribute("min", "1");
rangeInput.setAttribute("max", "10");
rangeInput.setAttribute("value", "10");
rangeInput.setAttribute("step", "1");
rangeInput.setAttribute("oninput", "updateRangeInput(this.value);");
let rangeInputText = document.createElement("span");
rangeInputText.setAttribute("id", "range-input-text");
div.appendChild(rangeInput);
div.appendChild(rangeInputText);

div.innerHTML += "<br><br>";
let registerBtn = document.createElement("button");
registerBtn.textContent = "Register";
div.appendChild(registerBtn);

body.appendChild(div);

updateRangeInput(rangeInput.value); // Init the range text
registerBtn.addEventListener("click", validateInput);

function updateRangeInput(value) {
    let rangeInputText = document.getElementById("range-input-text");
    rangeInputText.innerText = value;
}

function validateInput() {
    // valid username
    let usernameInput = document.getElementById("username-input");
    let username = usernameInput.value;
    if (username.length == 0) {
        alert("Empty username input");
        return;
    }

    // valid email
    // A valid email should have an @ and a domain after that, the domain should be at least 2-3 chars long
    let emailInput = document.getElementById("email-input");
    let email = emailInput.value;
    if (email.length == 0) {
        alert("Empty email input");
        return;
    }
    let emailUser = email.match(/.*?@/).toString();
    console.log(emailUser);
    let domain = email.match(/[^\@]*$/).toString();
    console.log(domain);

    if (emailUser.length <= 1 || domain.length <= 2) {
        alert("Invalid email input");
        return;
    }

    //valid password
    let passwordInput = document.getElementById("password-input");
    let password = passwordInput.value;
    let pass = password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
    if (pass == null) {
        alert(
            "Password must be at least 8 chars long and must contain at least 1 letter and 1 number"
        );
        return;
    }

    //valid radio
    let radios = document.getElementsByName("age");
    radio_value = null;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            radio_value = radios[i].value;
        }
    }

    if (radio_value == null) {
        alert("No age group has been selected");
        return;
    }

    alert("Register Successful");
    window.location.href = "/login.html";
}
