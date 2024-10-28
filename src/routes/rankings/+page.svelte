<script>   
    import GameCard from "$lib/components/custom/parts/GameCard.svelte";
    
    import { json } from "@sveltejs/kit";
  
  import { onMount } from "svelte";

  export let i = 0;

  // data

  let teams = []
  let records = {}
  let rankings = {}

  let rendered = false
  
  $: num_teams = teams.length

  // user choices

  let display_length = 4
  
  let display_width = 4

  let year = 2024

  let week = undefined

  let poll = 'AP Top 25'

  let query = ''

  let filtered_teams = []

  $: week_ranks = rankings[week ?? rankings.length -1]?.polls.filter(p => p.poll == poll)[0].ranks

//   $: week_teams = week_ranks != undefined ? week_ranks.map((team) => team.school) : undefined

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

    // loading complete

    let ranking_loaded = false

    let records_loaded = false

    let teams_loaded = false

    $: full_load = ranking_loaded && records_loaded && teams_loaded

    onMount(
        () => {

            rendered = true

          window.addEventListener('keydown', handleKeyPress);

            getTeams().then((r) => {

              console.log('Teaming')

              teams = []

              for (let team in r)
              {
                teams.push(r[team])
              }

              teams_loaded = true
            })


            updateRecords = function(year, week) {

                records = {}
            
                getTeamRecord(year, week).then((r) => r.forEach((element) => records[element.team] = element))

                console.log("Recording!")

                records_loaded = true
            }

            updateRecords(year, week)

            updateRankings = function(year, week) {
            
                getRankings(year, week).then((r) => {console.log(r, r.length); rankings = r; console.log(rankings.length)})

                console.log("Ranking!")

                ranking_loaded = true
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

<div class="flex w-[10]">

  <div class="grid grid-cols-5 grid-rows-5 gap-5 p-7 ">
      {#if week_ranks?.length == 25 && full_load}
        <!-- { week_ranks + "Happens" } -->
        {#each week_ranks as team, index}
          <GameCard team = { teams.filter((t) => team.school == t.school)[0] } record = { records[team.school] } ranking = { team }/>
        {/each}
      {/if}
  </div>
</div>