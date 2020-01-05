//////////////////
// MAIN MENU UI //
//////////////////
var mainMenuUi = document.createElement("div");
mainMenuUi.setAttribute("class", "ui-container");
mainMenuUi.setAttribute("id", "mainmenu-ui-container");

var mainMenuTitle = document.createElement("p");
mainMenuTitle.textContent = "DANI MOCANU\nEVADAREA";
mainMenuUi.appendChild(mainMenuTitle);

var mainMenuPlay = document.createElement("a");
mainMenuPlay.setAttribute("href", "#");
mainMenuPlay.setAttribute("class", "ui-button");
mainMenuPlay.setAttribute("id", "mainmenu-ui-play-button");
mainMenuPlay.textContent = "Play";
mainMenuUi.appendChild(mainMenuPlay);

var mainMenuHighscore = document.createElement("a");
mainMenuHighscore.setAttribute("href", "/highscores.html");
mainMenuHighscore.setAttribute("class", "ui-button");
mainMenuHighscore.setAttribute("id", "mainmenu-ui-highscore-button");
mainMenuHighscore.textContent = "Highscores";
mainMenuUi.appendChild(mainMenuHighscore);

var mainMenuLogin = document.createElement("a");
mainMenuLogin.setAttribute("href", "/login.html");
mainMenuLogin.setAttribute("class", "ui-button");
mainMenuLogin.setAttribute("id", "mainmenu-ui-login-button");
mainMenuLogin.textContent = "Login";
mainMenuUi.appendChild(mainMenuLogin);

var mainMenuLogout = document.createElement("a");
mainMenuLogout.setAttribute("href", "/logout.html");
mainMenuLogout.setAttribute("class", "ui-button");
mainMenuLogout.setAttribute("id", "mainmenu-ui-logout-button");
mainMenuLogout.textContent = "Logout";
mainMenuUi.appendChild(mainMenuLogout);

//////////////
// PAUSE UI //
//////////////
var pause_ui = document.createElement("div");
pause_ui.setAttribute("class", "ui-container");
pause_ui.setAttribute("id", "pause-ui-container");

var pause_text = document.createElement("p");
pause_text.textContent = "PAUSE";
pause_ui.appendChild(pause_text);

var pause_button_resume = document.createElement("a");
pause_button_resume.setAttribute("href", "#");
pause_button_resume.setAttribute("class", "ui-button");
pause_button_resume.setAttribute("id", "pause-ui-resume-button");
pause_button_resume.textContent = "Resume";
pause_ui.appendChild(pause_button_resume);

var pause_button_exit = document.createElement("a");
pause_button_exit.setAttribute("href", "#");
pause_button_exit.setAttribute("class", "ui-button");
pause_button_exit.setAttribute("id", "pause-ui-exit-button");
pause_button_exit.textContent = "Exit";
pause_ui.appendChild(pause_button_exit);

//////////////////
// GAME OVER UI //
//////////////////
var gameover_ui = document.createElement("div");
gameover_ui.setAttribute("class", "ui-container");
gameover_ui.setAttribute("id", "gameover-ui-container");

var gameover_text = document.createElement("p");
gameover_text.textContent = "GAME OVER";
gameover_ui.appendChild(gameover_text);

var gameover_score = document.createElement("p");
gameover_score.textContent = "SCORE: ";
gameover_score.setAttribute("id", "gameover-ui-score");
gameover_ui.appendChild(gameover_score);

var gameover_button_restart = document.createElement("a");
gameover_button_restart.setAttribute("href", "#");
gameover_button_restart.setAttribute("class", "ui-button");
gameover_button_restart.setAttribute("id", "gameover-ui-restart-button");
gameover_button_restart.textContent = "Restart";
gameover_ui.appendChild(gameover_button_restart);

var gameover_button_exit = document.createElement("a");
gameover_button_exit.setAttribute("href", "#");
gameover_button_exit.setAttribute("class", "ui-button");
gameover_button_exit.setAttribute("id", "gameover-ui-exit-button");
gameover_button_exit.textContent = "Exit";
gameover_ui.appendChild(gameover_button_exit);
