<script>

    import { Card } from "$lib/components/ui/card";
    import { onMount } from "svelte";

    // import { get } from 'svelte/store';

    import { themeStore, AltTheme } from "../themeStore/themeStore";

    // console.log(themeStore)

    let isDarkMode = false;

    let isAlt = false;

    themeStore.subscribe((value) => {
	    isDarkMode = value
    })
  
    AltTheme.subscribe((value) => {
	    isAlt = value
    })

    export let team;

    export let record;
    
    // console.log(team)

    $: c = team.color != null ? (team.altColor != null ? (isAlt ? (getColorSimilarity(team) > 2_000 ? team.altColor : (getDarkness(team) > 200_000 ? '#000_000' : '#EEE_EEE')) : team.color) : team.color) : '#000_000'

    $: ci = team.altColor != null ? (team.color != null ? (isAlt ? team.color : (getColorSimilarity(team) > 2_000 ? team.altColor : (getDarkness(team) > 200_000 ? '#000_000' : '#EEE_EEE'))) : team.altColor) : '#EEE_EEE'

    $: logo = team.logos[0] != undefined ? (isAlt ? team.logos[1] : team.logos[0]) : 'favicon.png'

    function imgNotFound() 
    {
        document.getElementById('logo').src = 'favicon.png'
    }

    function getColors(team) {
        let c = team.color

        let ci = team.altColor

        let red = parseInt(c.substring(1,3), 16)

        let redalt = parseInt(ci.substring(1,3), 16)

        let blue = parseInt(c.substring(3,5), 16)

        let bluealt = parseInt(ci.substring(3, 5), 16)

        let green = parseInt(ci.substring(5, 7), 16)

        let greenalt = parseInt(ci.substring(5, 7), 16)

        return [red, redalt, blue, bluealt, green, greenalt]
    }

    function getDarkness(team) {

        let [red, redalt, blue, bluealt, green, greenalt] = getColors(team)

        let score = (red + redalt) ** 2 + (blue + bluealt) ** 2 + (green + greenalt) ** 2

        return score

    }

    function getColorSimilarity(team) {

        let [red, redalt, blue, bluealt, green, greenalt] = getColors(team)

        let score = (red - redalt) ** 2 + (blue - bluealt) ** 2 + (green - greenalt) ** 2

        return score
    }

    console.log(record)

    onMount(
        () => {

            // submitData().then((responseData) => {record = responseData[0].total; document.getElementById("record-" + team.school).innerHTML = record.wins + ' : ' + record.losses; console.log(responseData)})

            // getColor(team)

            // getColorSimilarity(team)

        }
    )


</script>
  
<Card style='background-color: {c}; color: {ci};' class="flex gap-2 items-center justify-center h-32 text-lg font-semibold">
    
    <div style='background-color: {ci + "80"};' class="flex-5 flex justify-center p-1 rounded-full ">
        <img id='logo' style="" on:error={  (e) => {e.preventDefault(); e.target.src = 'favicon.png'} } src={ logo } alt="Team Logo" width="30" height="30" /> 
    </div>
    <div style="background-color: #80808000;" class="flex-6 flex flex-col justify-center">

        <div>
            {#if team.school.length > 15 && typeof team.abbreviation != 'undefined' } 

            { team.abbreviation }

            {:else}

            { team.school }

            {/if}

        </div>

        <div id="record-{ team.school }">

            {#if record != undefined}

            { record.total.wins } : { record.total.losses } 

            {:else}

            No Record

            {/if}

        </div>

        <!-- {#if getColorSimilarity(team) < 2000}

        <div class='bg-red-500 text-white'>Unsafe {getDarkness(team)}</div>

        {:else}

        <div class='bg-green-500 text-white'>Safe</div>

        {/if} -->

    </div>
</Card>
