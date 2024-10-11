<script lang='ts'>
    import { json } from "@sveltejs/kit";


  import GameCard from "../parts/GameCard.svelte";
  
  import { onMount } from "svelte";

  export let data;
  export let error;

  export let i = 0;

  console.log(i)

  data = JSON.parse(data.data)

  console.log(data)

  let num_teams = data.length

  console.log(num_teams)

  let query = ''

  $: filtered_teams = data.filter(team => team.school.toLowerCase().includes(query.toLowerCase()) || team.abbreviation.toLowerCase().includes(query.toLowerCase()))


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

  onMount(() => {

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
      <GameCard {team} />
    {/each}
  </div>
{/if}

