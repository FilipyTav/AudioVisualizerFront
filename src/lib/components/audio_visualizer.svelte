<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { fly } from 'svelte/transition';
	let { logo } = $props();
    import song from '$lib/assets/test.mp3'
    import { load_new_audio, map_to_db, type HashMap } from '$lib/utils/audio_processing';

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
    let analyzing: boolean = $state(false)
	let nextId = 0;

	const ping_activate = () => {
		const id = nextId++;
		pings = [...pings, { id }];

		// Remove ping after 1 second (animation duration)
		setTimeout(() => {
			pings = pings.filter(p => p.id !== id);
		}, .93 * 1000);
    }

    const API_URL = 'http://127.0.0.1:5000/prever';
    let resulting_data: HashMap = {
        "result": "",
        "certainty": "",
    }
    const send_audio = async (e: Event) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0];

        if (!file) return;
        console.log(file)
        // analyzing = true

        const form_data: FormData = new FormData();
        form_data.append('audio_file', file);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: form_data
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) { // Status 200
                resulting_data["certainty"] =  data["certeza_percentual"]
                resulting_data["result"] = map_to_db[data["classe_predita"]]
                console.log(resulting_data)
            } else {
            }
        } catch (error) {
            console.error('Erro de Rede ou JSON Inválido:', error);
            // resultadoDiv.innerHTML = '&lt;h2&gt;🛑 Erro de Conexão&lt;/h2&gt;&lt;p&gt;Verifique se o servidor Flask está rodando.&lt;/p&gt;';
        }
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
        onchange={send_audio}
        class="hidden">
		<div class="
		rounded-full aspect-square inline-block
        animate-[spin_3s_linear_infinite]
		absolute inset-0
        border-gradient
        "></div>
	</div>
    {#if analyzing}
        <p class="text-4xl animate-pulse">Analisando...</p>
    {/if}

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
