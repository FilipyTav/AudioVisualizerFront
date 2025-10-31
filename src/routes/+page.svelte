<style lang="postcss">
@reference "tailwindcss";
:global(body) {    
    min-height: 100vh;
    background-image: url('$lib/assets/bg.jpg');
    background-size: cover;
}
</style>

<script>
	import logo from "$lib/assets/logo.png";
    import bg from "$lib/assets/bg.jpg"
    import Nav from "$lib/components/nav.svelte";
    import AudioVisualizer from "$lib/components/audio_visualizer.svelte";
</script>

<Nav/>

<section class="">
    <div class="m-auto mt-3 w-4/5 h-[80vh] rounded-lg bg-white/20 backdrop-blur-sm p-6 shadow-lg grid place-items-center-safe">
        <AudioVisualizer { logo }/>
    </div>
</section>