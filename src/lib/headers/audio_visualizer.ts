import { ANALYSIS_DELAY, API_URL, ESP32_IP, PING_ANIME_INTERVAL } from '$lib/utils/config';
import { sleep } from '$lib/utils/utils';

const get_uploaded_audio = async (e: Event) => {
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
const record_microphone = async (): Promise<string | null> => {
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

const record_iot = async () => {
    try {
        const record_response = await fetch(ESP32_IP + '/record');

        if (!record_response.ok) throw new Error(`Erro no ESP32: ${record_response.statusText}`);

        const record_text = await record_response.text();
        console.log("ESP32:", record_text);

        return record_response;
    } catch (error) {
        console.error('Falha na comunicação com o ESP32:', error);
    }

    return null;
}

const download_audio = async () => {
    try {
        const audio_response = await fetch(ESP32_IP + '/audio');

        if (!audio_response.ok) throw new Error(`Erro ao baixar áudio: ${audio_response.statusText}`);

        const audio_blob = await audio_response.blob();

        const audio_file = new File([audio_blob], "esp32_gravacao.wav", { type: "audio/wav" });

        return audio_file;

        // setupAudioPlayer(audio_file);
        //
        // await uploadFileToBackend(audio_file);
    } catch (error) {
        console.error('Falha na comunicação com o ESP32:', error);
    }
}

// true if ok, false otherwise
const send_to_backend = async (file: File) => {
    const form_data: FormData = new FormData();
    form_data.append('audio_file', file);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: form_data
        });

        const data = await response.json();
        await sleep(ANALYSIS_DELAY);

        if (response.ok) { // Status 200
            return data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erro de Rede ou JSON Inválido:', error);
    }

    return null;
}

export { get_uploaded_audio, send_to_backend, play_audio, record_iot, download_audio };
