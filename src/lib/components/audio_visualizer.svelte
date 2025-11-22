<script lang="ts">
    import { fade, fly } from 'svelte/transition';
	let { logo, hide_vis, resulting_data } = $props();
    import { map_to_db } from '$lib/utils/audio_processing';
    import { PING_ANIME_INTERVAL } from '$lib/utils/config';
    import { get_uploaded_audio, play_audio, send_to_backend } from '$lib/headers/audio_visualizer';

    let audio_elem: HTMLAudioElement;
    let reader: FileReader | null = null;

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

    const start_analysis = (): number => {
        analyzing = true;
        const ping_id: number = setInterval(() => {
            if (Math.random() < 0.5) ping_activate()
        }, PING_ANIME_INTERVAL * 1000);

        return ping_id;
    }

    const end_analysis = (ping_id: number): void => {
        clearInterval(ping_id)
        analyzing = false;
    }

    const send_audio = async (e: Event) => {
        const file = await get_uploaded_audio(e);
        if (!file) return;

        play_audio(file, audio_elem);

        try {
            const ping_id = start_analysis()
            const data = await send_to_backend(file);
            if (data) {
                end_analysis(ping_id);
                resulting_data["precision"] =  data["certeza_percentual"]
                resulting_data["result"] = map_to_db[data["classe_predita"]]
                hide_vis()
            }
        } catch (error) {
            console.error('Erro de Rede ou JSON Inválido:', error);
        }
    }

    const record_audio = () => {
        analyzing = !analyzing;
    }
</script>

<!-- 90deg #58b873 #8259f0 -->
<div in:fly={{y: 1000, duration: 1 * 1000, delay: 1 * 1000}} out:fly={{y: 1000, duration: 1 * 1000}}
    class="relative md:w-xs sm:w-sm aspect-square grid place-items-center-safe
    col-start-1 row-start-1 gap-5
    ">
    <audio src=""
    class="hidden"
    bind:this={audio_elem}
    ></audio>

	<button class="relative cursor-pointer"
        onclick={record_audio}
    >
		<img src={logo} alt="Logo center" class="w-sm relative z-1 pointer-events-none">
		<div class="
		rounded-full aspect-square inline-block
        animate-[spin_3s_linear_infinite]
		absolute inset-0
        border-gradient
        "></div>

        {#each pings as ping (ping.id)}
            <div
            class="
            absolute inset-0 rounded-full opacity-75 animate-ping
            gradient-border
            "
            style="pointer-events: none;"
            ></div>
        {/each}
	</button>

    <div class="w-full grid place-items-center grid-cols-1 grid-rows-1">
        {#if analyzing}
            <p transition:fade
                class="text-4xl animate-pulse text-white
                col-start-1 row-start-1
                ">Analisando...</p>
        {:else}
            <label transition:fade
                for="audio_input"
                class="h-10 w-2/3 py-.5 cursor-pointer
                grid place-items-center
                upload-gradient
                frosted-glass
                col-start-1 row-start-1
                ">
                    <img src="/icons/icon_upload.png" alt="Upload Icon"
                        class="h-5 w-5"
                    >

                    <input type="file" id="audio_input" accept=".wav,.mp3,.ogg"
                    onchange={send_audio}
                    class="hidden">
            </label>
        {/if}
    </div>

</div>


<style lang="postcss">
@reference "tailwindcss";
@tailwind utilities;

.gradient-border {
    background: linear-gradient(to right, #58b873, #8259f0); /* gradient border */
}

.upload-gradient {
    border-width: 4px;
    border-radius: 12px;
    border-image: linear-gradient(to right, #58b873, #8259f0) 1;
}

.border-gradient {
    border: 15px solid transparent; /* thickness of border */
    background:
        linear-gradient(#5b5c5b, #5b5b5a) padding-box, /* transparent inner */
        linear-gradient(to right, #58b873, #8259f0) border-box; /* gradient border */
}

.frosted-glass {
    background: rgba(255, 255, 255, 0.7);  /* Semi-transparent white */
    backdrop-blur: 10px;  /* Apply blur to the background */
    border-radius: 10px;  /* Rounded corners */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  /* Optional shadow for depth */
}
</style>
