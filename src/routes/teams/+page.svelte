<script>
    import GameDisplay from "$lib/components/custom/gamedisplay/GameDisplay.svelte";

    import { Button } from "$lib/components/ui/button";

    export let data
    export let error;

    let i = 0;

    console.log(data)

    console.log(error)

</script>

<GameDisplay { data } {error} { i } />