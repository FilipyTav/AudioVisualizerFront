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

// Usage:
// const audioUrl: string | null = await startRecording();
// if (audio_url) {
//     console.log("Recording complete, audio URL:", audio_url);
//     // You can use the audio URL in an <audio> element, or download it
//     const audio_element: HTMLAudioElement = new Audio(audio_url);
//     audio_element.play();
// }
const start_recording = async (): Promise<string | null> => {
    try {
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        const media_recorder: MediaRecorder = new MediaRecorder(stream);
        const audio_chunks: Blob[] = [];

        media_recorder.ondataavailable = (event: BlobEvent) => {
            audio_chunks.push(event.data);
        };

        media_recorder.start();

        await new Promise<void>((resolve) => setTimeout(resolve, 5000));

        media_recorder.stop();
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop()); // Stop the stream

        return new Promise((resolve) => {
            media_recorder.onstop = () => {
                const audio_blob: Blob = new Blob(audio_chunks, {
                    type: "audio/wav",
                });
                const audio_url: string = URL.createObjectURL(audio_blob);
                resolve(audio_url);
            };
        });
    } catch (err) {
        console.error("Error accessing microphone:", err);
        return null;
    }
};

export { get_audio, play_audio, start_recording };
