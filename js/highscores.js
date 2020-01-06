var body = document.getElementsByTagName("body")[0];

let div = document.createElement("div");
div.innerHTML += "<h2>Highscores<h2><br><br>";

let highscores = JSON.parse(window.localStorage.getItem("highscores"));
if (highscores == null) {
    highscores = [];
}
highscores.sort(function(a, b) {
    return a.score - b.score;
});

let i;
for (i = 0; i < highscores.length; i++) {
    let entry = document.createElement("p");
    entry.textContent = highscores[i].user + ": " + highscores[i].score;
    div.append(entry);
}

body.appendChild(div);
