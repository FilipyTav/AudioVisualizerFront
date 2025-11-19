const get_audio = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    return file;
};

const play_audio = (file: File, audio_elem: HTMLAudioElement): void => {
    const obj_URL = URL.createObjectURL(file);
    audio_elem.src = obj_URL;
    audio_elem.play();
};

export { get_audio, play_audio };
