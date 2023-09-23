export function shotAudioPlay() {
    let SHOT_AUDIO = new Audio('./audio/shotAudio.mp3')
    SHOT_AUDIO.play();
    SHOT_AUDIO.volume = 0.5;

}

export function hitAudioPlay() {
    let HIT_AUDIO = new Audio('./audio/hitAudio.mp3')
    HIT_AUDIO.play();
    HIT_AUDIO.volume = 0.5;
}

export function killAudioPlay() {
    let KILL_AUDIO = new Audio('./audio/killAudio.mp3');
    KILL_AUDIO.play();
    KILL_AUDIO.volume = 0.5;
}

export function failAudioPlay() {
    let FAIL_AUDIO = new Audio('./audio/failAudio.mp3');
    FAIL_AUDIO.play();
    FAIL_AUDIO.volume = 0.5;
}