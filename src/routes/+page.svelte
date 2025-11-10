<style lang="postcss">
@reference "tailwindcss";
:global(body) {    
    min-height: 100vh;
    background-image: url('$lib/assets/bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
}
</style>

<script>
	import logo from "$lib/assets/logo.png";
    import bg from "$lib/assets/bg.png"
    import Nav from "$lib/components/nav.svelte";
    import AudioVisualizer from "$lib/components/audio_visualizer.svelte";
</script>

<Nav/>

<section class="overflow-hidden">
	<div class="m-auto mt-3 w-4/5 h-[80vh] rounded-lg bg-white/20 backdrop-blur-[3px] p-6 shadow-lg grid place-items-center-safe">
        <AudioVisualizer {logo} />
    </div>
</section>
