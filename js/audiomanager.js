class AudioManager {
    constructor(audioSources) {
        this.audioSources = audioSources;
        if (this.audioSources == null) {
            this.audioSources = [];
        }

        this.audioComponents = []; // keeps track of all the active audio components
    }

    create(audioSrcIndex, loop) {
        let audio = document.createElement("audio");
        audio.src = this.audioSources[audioSrcIndex];
        audio.setAttribute("preload", "auto");
        audio.setAttribute("controls", "none");
        audio.loop = loop;
        audio.style.display = "none";

        this.audioComponents.push(audio);
        document.body.appendChild(audio);
    }

}