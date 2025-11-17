<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { fly } from 'svelte/transition';
	let { logo } = $props();
    import song from '$lib/assets/test.mp3'
    import { load_new_audio } from '$lib/utils/audio_processing';

    let audio: HTMLAudioElement;
    let reader: FileReader | null = null;

    const play_audio = (): void => {
        console.log(audio);
        if (audio.paused)
            audio.play();
        else audio.pause();
    }

    onMount(() => {
        reader =  new FileReader();
        if (browser) {
            audio = new Audio(song);
            // console.log(audio);

            (async () => {
                const array_buffer = await load_new_audio(song);
                console.log(array_buffer);

                const audio_ctx: AudioContext = new AudioContext()
                audio_ctx.decodeAudioData(array_buffer, (audio_buffer) => {
                    console.log(audio_buffer)
                })
            })();
        };
    });

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
<label in:fly={{y: 1000, duration: 1 * 1000, delay: 1 * 1000}} out:fly={{y: 1000, duration: 1 * 1000}}
    for="audio_input"
    class="relative md:w-xs sm:w-sm aspect-square cursor-pointer grid place-items-center-safe
    col-start-1 row-start-1
    ">
	<div>
		<img src={logo} alt="Logo center" class="w-sm relative z-1 pointer-events-none">
        <input type="file" id="audio_input" accept=".wav,.mp3,.ogg"
        class="hidden">
		<div class="
		rounded-full aspect-square inline-block
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
</label>


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
