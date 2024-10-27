<script lang='ts'>

  import { json } from "@sveltejs/kit";

  import GameCard from "../parts/GameCard.svelte";
  
  import { onMount } from "svelte";

  export let i = 0;

  // data

  let teams = []
  let records = {}
  let rankings = {}

  let rendered = false
  
  $: num_teams = teams.length

  // user choices

  let year = 2024

  let week = undefined

  let poll = 'AP Top 25'

  let query = ''

  let filtered_teams = []

  // filters teams based on search, if fails then display nothing
  $: {

    i = 0

    try
    { 
      filtered_teams = teams.filter(team => team.school.toLowerCase().includes(query.toLowerCase()) || ((team.abbreviation != null) ? team.abbreviation.toLowerCase().includes(query.toLowerCase()) : false) || ((team.conference != null) ? (team?.conference.toLowerCase().includes(query.toLowerCase())) : false) || ((team.mascot != null) ? (team.mascot.toLowerCase().includes(query.toLowerCase())) : false))
    }
    catch (error)
    {
      filtered_teams = []
      console.log(error)
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

    // handling teams

    // handling records

    let updateRecords;

    // handling rankings

    let updateRankings;

    onMount(
        () => {

          window.addEventListener('keydown', handleKeyPress);

            getTeams().then((r) => {

              console.log('Teaming')

              teams = []

              for (let team in r)
              {
                teams.push(r[team])
              }
            })


            updateRecords = function(year, week) {

                records = {}
            
                getTeamRecord(year, week).then((r) => r.forEach((element) => records[element.team] = element))

                console.log("Recording!")
            }

            updateRecords(year, week)

            updateRankings = function(year, week) {
            
                getRankings(year, week).then((r) => {console.log(r, r.length); rankings = r; console.log(rankings.length)})

                console.log("Ranking!")
            }

            updateRankings(year, week)

        }
    )

    // getting data

    async function getTeams() {

        try 
        {
            const response = await fetch('api/cfb/teamsapi/getteams', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                }
            });

            let r = await response.json()

            r = JSON.parse(r)

            return r
        } 
        catch (error) 
        {
            console.error('Error:', error);
        }
    }

    async function getTeamRecord(year, week) {

        try 
        {
            const response = await fetch('api/cfb/gamesapi/teamrecords', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'year' : year, 'week' : week})  // Send the user input to the backend
            });

            let r = await response.json()


            return r
        } 
        catch (error) 
        {
            console.error('Error:', error);
        }
    }

    async function getRankings(year, week) {

      try 
      {
          const response = await fetch('api/cfb/rankingsapi/getrankings', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 'year': year, 'week': week })
          });

          let r = await response.json()

          return r
      } 
      catch (error) 
      {
        console.error('Error:', error);
      }
    }
  
</script>
 
<!-- .filter(p => p.poll == poll).ranks.filter(t => t.school == 'Oregon') -->

<div class="flex w-full justify-center">

  <div class="">

    <label for="name">Enter your name:</label>
    <input class="dark:text-black max-w-sm" id="name" type="text" bind:value={query} placeholder="Type your name" />

  </div>

</div>


<div class="grid grid-cols-4 gap-5 p-7">
  {#each filtered_teams.slice(i*16, (i*16)+16) as team, index}
    <GameCard { team } record = { records[team.school] } ranking = { rankings[week ?? rankings.length -1]?.polls.filter(p => p.poll == poll)[0].ranks.filter(t => t.school == team.school)[0] }/>
  {/each}
</div>

