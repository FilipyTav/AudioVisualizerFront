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

<!-- 90deg #58b873 #8259f0 -->
<button onclick={ping_activate} class="relative w-80 h-80 cursor-pointer grid place-items-center-safe">
	<div>
		<!-- bg-[radial-gradient(circle,rgba(109,11,121,1)_50%,rgba(50,255,100,1)_80%)]  -->
		<img src={logo} alt="Logo center" class="w-sm relative z-1">
		<div class="
		rounded-full w-80 aspect-square inline-block 
        animate-[spin_3s_linear_infinite]
		absolute inset-0 
        border-gradient
        "></div>
	</div>

	{#each pings as ping (ping.id)}
		<div
		class="
		absolute inset-0 rounded-full opacity-75 animate-ping
		circle-pulse
		"
		style="pointer-events: none;"
		></div>
	{/each}
</button>


<style lang="postcss">  
@reference "tailwindcss";  
@tailwind utilities;

.circle-pulse {
    @apply 
    bg-linear-90 from-[#58b873] to-[#8259f0];
}

.border-gradient {
    border: 15px solid transparent; /* thickness of border */
    background: 
        linear-gradient(#5b5c5b, #5b5b5a) padding-box, /* transparent inner */
        linear-gradient(to right, #58b873, #8259f0) border-box; /* gradient border */
}

</style>
