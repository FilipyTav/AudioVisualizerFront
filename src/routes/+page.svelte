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

<script>
	import logo from "$lib/assets/logo.png";
    import bg from "$lib/assets/bg.png"
    import Nav from "$lib/components/nav.svelte";
    import AudioVisualizer from "$lib/components/audio_visualizer.svelte";
</script>

<Nav/>

<section class="overflow-hidden flex justify-center items-center">
	<div class="mx-auto my-10 
        w-4/5 h-9/10 rounded-lg bg-white/20 backdrop-blur-[3px] p-6 shadow-lg grid place-items-center-safe
        ">
            <AudioVisualizer {logo} />
    </div>
</section>
