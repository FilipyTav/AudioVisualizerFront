<style lang="postcss">
@reference "tailwindcss";
:global(body) {
    position: relative;
    min-height: 100vh;
    background-image: url('$lib/assets/bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;

    display: grid;
    grid-template-rows: 50px repeat(auto-fit, minmax(150px, 1fr));
    gap: 5px;
}
</style>

<script lang="ts">
	import logo from "$lib/assets/logo.png";
    import Nav from "$lib/components/nav.svelte";
    import AudioVisualizer from "$lib/components/audio_visualizer.svelte";
    import InfoDisplay from "$lib/components/info_display.svelte";
    import type { HashMap } from "$lib/utils/audio_processing";

    let resulting_data: HashMap = {
        "result": "",
        "precisiont": "",
    }

    let show_visualizer: boolean = $state(true);

    const show_vis = () => {
        show_visualizer = true;
    }

    const hide_vis = () => {
        show_visualizer = false;
    }
</script>

<Nav/>

<section class="overflow-hidden flex justify-center items-center">
	<div class="mx-auto my-10 animate-down
        w-4/5 min-h-9/10 rounded-lg bg-white/20 backdrop-blur-[3px] p-6 shadow-lg
        grid place-items-center-safe grid-rows-[1fr] grid-cols-[1fr]
        ">
        {#if show_visualizer}
            <AudioVisualizer {logo} {hide_vis} {resulting_data}/>
        {:else}
            <InfoDisplay {resulting_data} {show_vis}/>
        {/if}
    </div>
</section>
