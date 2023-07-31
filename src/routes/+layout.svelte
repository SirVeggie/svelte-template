<script lang="ts">
    import "../global.css";
    import "../scroll.css";
    import { assets } from "$app/paths";
</script>

<svelte:head>
    <title>Svelte Template</title>
    <link rel="manifest" href={`${assets}/manifest.json`} />
</svelte:head>

<slot />