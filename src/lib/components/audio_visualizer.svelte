<script lang="ts">
	let { logo } = $props();

	interface Ping {
		id: number;
	}

	let pings: Ping[] = $state([]);
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

<button onclick={ping_activate} class="relative w-80 h-80 cursor-pointer grid place-items-center-safe">
	<div>
		<img src={logo} alt="Logo center" class="w-sm relative z-1">
		<div class="
		rounded-full w-80 aspect-square inline-block animate-pulse
		bg-[radial-gradient(circle,rgba(109,11,121,1)_50%,rgba(50,255,100,1)_80%)] 
		absolute inset-0 
	"></div>
	</div>
	{#each pings as ping (ping.id)}
		<div
		class="
		absolute inset-0 rounded-full opacity-75 animate-ping
		bg-[radial-gradient(circle,rgba(109,11,121,1)_50%,rgba(50,255,100,1)_80%)] 
		"
		style="pointer-events: none;"
		></div>
	{/each}
</button>


<!-- <div class="before:rounded-full before:w-5 before:aspect-square before:inline-block before:animate-ping
before:bg-[radial-gradient(circle,rgba(109,11,121,1)_50%,rgba(50,255,100,1)_80%)] 
"> -->

<!-- </div> -->

<style lang="postcss">  
@reference "tailwindcss";  
@tailwind utilities;

/* .circle-pulse {
@apply bg-[radial-gradient(circle,rgba(109,11,121,1)_50%,rgba(50,255,100,1)_80%)],
 rounded-full;
} */
</style>