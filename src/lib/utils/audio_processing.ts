const load_new_audio = async (audio: string): Promise<ArrayBuffer> => {
    const array_buffer = await read_audio_array_buffer(audio);
    return array_buffer
}

const read_audio_array_buffer = async (url: string) => {
    const response = await fetch(url);          // Fetch the MP3 file
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();  // Read the response as ArrayBuffer
    return arrayBuffer;                          // Return the binary data
}

type HashMap = Record<string, string>;
const map_to_db: HashMap = {
    "bemtevi": "Bem-te-vi",
    "sabia" : "Sabiá-laranjeira"
}

const record_audio = async () => {
    try {
        const record_response = await fetch(ESP32_IP + '/record');

        if (!record_response.ok) throw new Error(`Erro no ESP32: ${recordResponse.statusText}`);

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

export {load_new_audio, read_audio_array_buffer, map_to_db, HashMap}
