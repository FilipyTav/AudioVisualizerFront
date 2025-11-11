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
    import bg from "$lib/assets/bg.png"
    import Nav from "$lib/components/nav.svelte";
    import AudioVisualizer from "$lib/components/audio_visualizer.svelte";
    import InfoDisplay from "$lib/components/info_display.svelte";

    let show_visualizer: boolean = $state(true);

    function handleKeydown(event) {
        console.log('Key pressed:', event.key);
        if (event.key === 's') {
            console.log('s key detected!');
            show_visualizer = !show_visualizer;
        }
    }
</script>

<Nav/>

<svelte:window onkeydown={handleKeydown} />

<section class="overflow-hidden flex justify-center items-center">
	<div class="mx-auto my-10 animate-down
        w-4/5 h-9/10 rounded-lg bg-white/20 backdrop-blur-[3px] p-6 shadow-lg grid place-items-center-safe
        ">
        {#if show_visualizer}
            <AudioVisualizer {logo}/>
        {:else}
            <InfoDisplay />
        {/if}
    </div>
</section>
