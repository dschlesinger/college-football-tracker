<script>
    import GameDisplay from "$lib/components/custom/gamedisplay/GameDisplay.svelte";

    import { Button } from "$lib/components/ui/button";

    export let data
    export let error;

    console.log(typeof data.teamdata, typeof data.records)

    let i = 0;

</script>

<GameDisplay  teamdata = { data.teamdata } records = { data.records } {error} { i } />