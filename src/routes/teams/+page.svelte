<script>

    import GameDisplay from "$lib/components/custom/gamedisplay/GameDisplay.svelte";

    import { Button } from "$lib/components/ui/button";
    import { onMount } from "svelte";

    let i = 0;


</script>

<GameDisplay { i } />