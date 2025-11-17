<script lang="ts">
	let { resulting_data, show_vis} = $props();
    import db from '$lib/assets/info.json'
    import { fade, fly } from 'svelte/transition';

    interface Paragraph {
        text: string;
        row_start: number;
        row_span: number;
        col_start: number;
        col_span: number;
    }
    const data = db.find(bird => bird.name === resulting_data["result"])

    const paragraphs: Paragraph[] = [
        {text: "", row_start: 1, row_span: 2, col_start: 3, col_span: 3},
        {text: "", row_start: 3, row_span: 3, col_start: 1, col_span: 3},
    ]
</script>

<button
    transition:fade
    onclick={show_vis}
    class="
    font-bold w-10 aspect-square bg-red-600 rounded-full
    grid place-items-center-safe z-2
    absolute -top-3 -left-3
    cursor-pointer
    ">&#x2B9C;</button>

    <!-- grid-cols-[repeat(5,minmax(100px,1fr))] grid-rows-[repeat(5,minmax(100px,1fr))] -->
<div in:fly={{y: 1000, duration: 1 * 1000, delay: 1 * 1000}} out:fly={{y: 1000, duration: 1 * 1000}}
    class="grid gap-3 col-start-1 row-start-1 h-max
    ">
    <img src={data?.images[0]} alt="Imagem 1"
        class="bg-red-300
        row-start-1 row-span-2
        col-start-1 col-span-2
        "/>
    <img src={data?.images[1]} alt="Imagem 2"
        class="bg-purple-300
        col-start-4 col-span-2
        row-start-3 row-span-3
        "/>

    {#each data?.info as para, i}
        <div class="
            break-all bg-green-500 p-5 break-normal
            "
            style={`
            grid-column: ${paragraphs[i].col_start} / span ${paragraphs[i].col_span};
            grid-row: ${paragraphs[i].row_start} / span ${paragraphs[i].row_span};
            `}
        >
            {#if i === 0}
                <p class="font-bold">{data?.name}</p>
                <p class="font-bold">{data?.scientific_name}</p>
            {/if}
            {para}
        </div>
    {/each}
</div>
