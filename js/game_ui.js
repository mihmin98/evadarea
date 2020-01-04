var pause_ui = document.createElement('div');
pause_ui.setAttribute('class', 'ui-container');
pause_ui.setAttribute('id', 'pause-ui-container');

var pause_text = document.createElement('p');
pause_text.textContent = 'PAUSE'
pause_ui.appendChild(pause_text);

var pause_button_resume = document.createElement('a');
pause_button_resume.setAttribute('href', '#');
pause_button_resume.setAttribute('class', 'ui-button');
pause_button_resume.textContent = 'Resume';
pause_ui.appendChild(pause_button_resume);

var pause_button_exit = document.createElement('a');
pause_button_exit.setAttribute('href', '#');
pause_button_exit.setAttribute('class', 'ui-button');
pause_button_exit.textContent = 'Exit';
pause_ui.appendChild(pause_button_exit);