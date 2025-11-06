<script lang="ts">
  import { onMount } from 'svelte';
  let ping = false;

  onMount(() => {
    const interval = setInterval(() => {
      ping = true;
      setTimeout(() => {
        ping = false;
      }, 1 * 1000); // matches animation duration
    }, 2 * 1000); // ping effect every 2 seconds

    return () => clearInterval(interval);
  });
</script>

<div class="relative w-16 h-16">
  <div class="absolute inset-0 rounded-full bg-purple-600"></div>
  {#if ping}
    <div class="absolute inset-0 rounded-full bg-purple-400 opacity-75 animate-ping"></div>
  {/if}
</div>

<!-- <script lang="ts">
	let { logo } = $props();
</script> -->

<!-- <img src={logo} alt="Logo center" class="w-sm"> -->

<!-- <div class="before:rounded-full before:w-5 before:aspect-square before:inline-block before:animate-ping
before:bg-[radial-gradient(circle,rgba(109,11,121,1)_50%,rgba(50,255,100,1)_80%)] 
"> -->

<!-- </div> -->