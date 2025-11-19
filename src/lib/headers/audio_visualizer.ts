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

// Function to start recording using async/await
const start_recording = async () => {
    try {
        // Access the microphone
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        // Create a MediaRecorder to record the audio
        const media_recorder = new MediaRecorder(stream);
        const audio_chunks = [];

        // When data is available, store the audio chunks
        media_recorder.ondataavailable = (event) => {
            audio_chunks.push(event.data);
        };

        // When the recording stops, create a Blob and play the audio
        media_recorder.onstop = () => {
            const audio_blob = new Blob(audio_chunks, { type: "audio/wav" });
            const audio_url = URL.createObjectURL(audio_blob);
            const audio = new Audio(audio_url);
            audio.play();
        };

        // Start recording
        media_recorder.start();

        // Stop recording after 5 seconds
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Stop the recording after 5 seconds
        media_recorder.stop();
        stream.getTracks().forEach((track) => track.stop()); // Stop the stream
    } catch (err) {
        console.error("Error accessing microphone:", err);
    }
};

export { get_audio, play_audio, start_recording };
