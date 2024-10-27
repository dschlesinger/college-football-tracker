import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

import cfb from 'cfb.js';
import 'dotenv/config';

const defaultClient = cfb.ApiClient.instance;
const ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
ApiKeyAuth.apiKey = `Bearer ${process.env.CFB_API_KEY}`;

export async function load() {
    
    try {

        const ratingsopts = {
            'year': 2024,
            'week': 1
        }

        const teamopts = { year: 2024 };  // Year filter

        const recordopts = { year: 2024 }

        // PI call to get FBS Teams
        const teamsApi = new cfb.TeamsApi();

        let teamdata = await teamsApi.getTeams(teamopts);

        teamdata = teamdata.filter(dp => (dp.mascot != undefined) && (dp.conference != undefined) && (dp.logos != undefined))

        teamdata = JSON.stringify(teamdata)

        const gamesApi = new cfb.GamesApi();
      
        let r = await gamesApi.getTeamRecords(recordopts)

        let records = {}
    
        r.forEach((team) => {records[team.team] = team})

        records = JSON.stringify(records)

        const RatingApi = new cfb.RatingsApi();

        let EloRatings = await RatingApi.getEloRatings(ratingsopts)

        let eloratingdata = {}

        // EloRatings.forEach(element => {
        //     eloratingdata[element.team] = element
        // });

        console.log(eloratingdata)

        eloratingdata = JSON.stringify(EloRatings)

        // console.log(ratingdata)

        // console.log(records)

        // Return the fetched data to the frontend
        return {
            teamdata,
            records,
            eloratingdata
        };
    } catch (error) {
        console.error('Error during API call:', error);

        // In case of an error, return a meaningful message

        return {
            error
        };
    }}