<script lang="ts">
    import { fly } from 'svelte/transition';

    interface Paragraph {
        text: string;
        row_start: number;
        row_span: number;
        col_start: number;
        col_span: number;
    }

    const paragraphs: Paragraph[] = [
        {text: "", row_start: 1, row_span: 2, col_start: 3, col_span: 3},
        {text: "", row_start: 3, row_span: 3, col_start: 1, col_span: 3},
    ]
</script>

<div class="grid gap-3 
    grid-cols-[repeat(5,_minmax(100px,_500px))] grid-rows-[repeat(5,_minmax(100px,_100px))]">
    <div class="bg-red-300
        row-start-1 row-span-2
        col-start-1 col-span-2
        "></div>
    <div class="bg-purple-300
        col-start-4 col-span-2
        row-start-3 row-span-3
        "></div>

    {#each paragraphs as para}
        <p class="
            col-start-{para.col_start} col-span-{para.col_span}
            row-start-{para.row_start} row-span-{para.row_span}
            break-all bg-green-500">
            {para.text}
        </p>
    {/each}
</div>
