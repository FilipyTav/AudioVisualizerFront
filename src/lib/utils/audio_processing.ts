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

export {load_new_audio, read_audio_array_buffer}
