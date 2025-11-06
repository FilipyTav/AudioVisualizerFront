<script lang="ts">
	interface Ping {
		id: number;
	}

	let pings: Ping[] = [];
	let nextId = 0;

	const ping_activate = () => {
		const id = nextId++;
		pings = [...pings, { id }];
	
		// Remove ping after 1 second (animation duration)
		setTimeout(() => {
			pings = pings.filter(p => p.id !== id);
		}, .93 * 1000);
  }
</script>

<button onclick={ping_activate} class="relative w-50 h-50 cursor-pointer">
	<!-- <div
	class="absolute inset-0 rounded-full bg-purple-400 opacity-75 animate-pulse"
	style="pointer-events: none;"
	></div> -->
	<div class="
	rounded-full w-50 aspect-square inline-block animate-pulse
	bg-[radial-gradient(circle,rgba(109,11,121,1)_50%,rgba(50,255,100,1)_80%)] 
	absolute inset-0 circle-pulse
	"></div>
	{#each pings as ping (ping.id)}
		<div
		class="
		absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(109,11,121,1)_50%,rgba(50,255,100,1)_80%)] opacity-75 animate-ping
		"
		style="pointer-events: none;"
		></div>
	{/each}
</button>

<!-- <script lang="ts">
	let { logo } = $props();
</script> -->

<!-- <img src={logo} alt="Logo center" class="w-sm"> -->

<!-- <div class="before:rounded-full before:w-5 before:aspect-square before:inline-block before:animate-ping
before:bg-[radial-gradient(circle,rgba(109,11,121,1)_50%,rgba(50,255,100,1)_80%)] 
"> -->

<!-- </div> -->

<style lang="postcss">  
@reference "tailwindcss";  
@tailwind utilities;

.circle-pulse {
@apply bg-[radial-gradient(circle,rgba(109,11,121,1)_50%,rgba(50,255,100,1)_80%)],
 rounded-full;
}
</style>