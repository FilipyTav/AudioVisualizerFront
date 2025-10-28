<script lang="ts">
  import { onMount } from 'svelte';

  let audioElement: HTMLAudioElement;
  let analyser: AnalyserNode;
  let bufferLength: number;
  let dataArray: Uint8Array;

  onMount(() => {
    // Create the AudioContext and AnalyserNode
    const audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();

    // Get the audio element
    audioElement = document.getElementById('audio') as HTMLAudioElement;

    // Create source node for the audio element
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Set analyser properties
    analyser.fftSize = 256; // Number of frequency bins
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    // Play the audio
    audioElement.play();

    // Update the visualizer
    const updateVisualizer = () => {
      analyser.getByteFrequencyData(dataArray);
      requestAnimationFrame(updateVisualizer);
    };

    updateVisualizer();
  });
</script>

<div class="flex flex-col items-center justify-center h-screen bg-gray-900">
  <!-- Audio Controls -->
  <audio id="audio" controls class="mb-10 w-3/4 max-w-xl rounded-lg shadow-lg">
    <source src="/your-audio-file.mp3" type="audio/mp3" />
    Your browser does not support the audio element.
  </audio>

  <!-- Visualizer -->
  <div class="flex space-x-1 items-end h-60">
    {#each Array.from({ length: bufferLength }) as _, i}
      <div
        class="w-2 bg-yellow-400 rounded-full transition-all"
        style="height: {dataArray[i]}px; opacity: {dataArray[i] / 255}"
      ></div>
    {/each}
  </div>
</div>