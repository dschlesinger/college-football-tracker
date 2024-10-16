<script lang='ts'>
    import { json } from "@sveltejs/kit";


  import GameCard from "../parts/GameCard.svelte";
  
  import { onMount } from "svelte";

  // import {  }

  export let teamdata;
  export let records;
  export let error;

  export let i = 0;

  // console.log(i)

  teamdata = JSON.parse(teamdata)

  records = JSON.parse(records)

  let num_teams = teamdata.length

  // console.log(num_teams)

  let query = ''

  $: filtered_teams = teamdata.filter(team => team.school.toLowerCase().includes(query.toLowerCase()) || ((team.abbreviation != null) ? team.abbreviation.toLowerCase().includes(query.toLowerCase()) : false) || ((team.conference != null) ? (team.conference.toLowerCase().includes(query.toLowerCase())) : false))


  async function getTeamRecord() {

    try {
          const response = await fetch('api/cfb/gamesapi/teamrecords', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
              },
              body: JSON.stringify({ })  // Send the user input to the backend
          });

          return await response.json()
      } catch (error) {
      console.error('Error:', error);
      }
    }

  function handleKeyPress(event) {
    if (event.key === 'ArrowRight') {

      if ((i + 1) * 16 <= num_teams) {
        i += 1
      }

    } else if (event.key === 'ArrowLeft') {

      if ((i - 1) >= 0) {
        i -= 1
      }
    }
  }

  let record = {}


  onMount(() => {

  //   getTeamRecord().then((r) =>
  //   {r.forEach(element => {
  //     console.log(element);
  //     record[element.team] = element.total
  //   })


    window.addEventListener('keydown', handleKeyPress);

  })
  
</script>

<div class="flex w-full justify-center">

  <div class="">

    <label for="name">Enter your name:</label>
    <input class="dark:text-black max-w-sm" id="name" type="text" bind:value={query} placeholder="Type your name" />

  </div>

</div>

{#if error}
  <p class="text-red-500">Error: {error}</p>
{:else}
  <div class="grid grid-cols-4 gap-5 p-7">
    {#each filtered_teams.slice(i*16, (i*16)+16) as team, index}
      <GameCard { team } record = { records[team.school] } />
    {/each}
  </div>
{/if}

