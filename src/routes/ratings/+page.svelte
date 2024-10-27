<script>
    import GameCard from '$lib/components/custom/parts/GameCard.svelte';
    import { json } from '@sveltejs/kit';
    import { onMount } from 'svelte';

    import Button from '$lib/components/ui/button/button.svelte';


    export let data;

    let elorankings = JSON.parse(data.eloratingdata)

    let teamdata = JSON.parse(data.teamdata)

    // let records = JSON.parse(data.records)

    // console.log(elorankings)

    let system = 'elo'

    $: displayratings = (system == 'elo' ? elorankings : null).sort((a, b) => b.elo - a.elo)

    let week = 0

    let rendered = false

    let records = {}

    let rankings = {}

    let teams = {}

    async function getTeamRecord(week) {

        try {
            const response = await fetch('api/cfb/gamesapi/teamrecords', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'week': week })  // Send the user input to the backend
            });

            let r = await response.json()

            console.log(r)

            return r
        } catch (error) {
        console.error('Error:', error);
        }
        }

        async function getRankings(year, week) {

            try {
                const response = await fetch('api/cfb/rankingsapi/getrankings', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 'year': year })  // Send the user input to the backend , 'week': week 
                });

                let r = await response.json()

                console.log(r)

                return r
            } catch (error) {
            console.error('Error:', error);
            }
}

        async function getTeams() {

        try {
            const response = await fetch('api/cfb/teamsapi/getteams', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                }
            });

            let r = await response.json()

            console.log(r)

            return r
        } catch (error) {
        console.error('Error:', error);
        }
        }

        let updateRecords = undefined

        let updateRankings = undefined

    onMount(
        () => {
            rendered = true

            teams = getTeams()

            updateRecords = function(week) {
            
                getTeamRecord(week).then((r) => r.forEach((element) => records[element.team] = element))

                console.log("Updating!")
            }

            updateRecords(week)

            updateRankings = function(week) {
            
                getRankings(2024, week).then((r) => {rankings = r})

                console.log("Ranking!")
            }

            updateRankings(week)
        }

    )

</script>

{#if rankings.length > 0 && Object.keys(records).length > 0}
{#each [0, 1, 2, 3, 4] as i}
    <div class=' grid-cols-5 grid-rows-5 flex-col grid gap-x-5 justify-start'>
    {#each displayratings.slice(i*5, (i+1)*5) as team, index}
            <div class=''>

                <GameCard team={teams[team.team]} />
                { team.team }: { team.elo } { rendered && records[team.team] != undefined ? records[team.team].total.wins : "_" } : { rendered && records[team.team] != undefined ? records[team.team].total.losses : "_" }
            </div>
    {/each}
    </div>
{/each}
{:else}
{ rankings.length } { Object.keys(records).length } <br>
{ typeof rankings } { typeof records } <br>
{ rankings.length } { records.length } <br>
{/if}