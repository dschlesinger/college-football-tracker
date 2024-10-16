
import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

import cfb from 'cfb.js';
import 'dotenv/config';

const defaultClient = cfb.ApiClient.instance;
const ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
ApiKeyAuth.apiKey = `Bearer ${process.env.CFB_API_KEY}`;

function getImageValid(url) {


    if (url != undefined) {

        fetch(url).then((page) =>
            {
                console.log(page.text())
            }
        )
    
        return true
    }

    else {
        return false
    }
}

async function getTeamRecord() {
        try {
            
          let opts = {
              'year' : 2024
          }
      
          // Call the API using your Node package
          const apiInstance = new cfb.GamesApi();
      
          let data = await apiInstance.getTeamRecords(opts)
      
          // Return the data in a JSON response
          return json(data);
        } catch (error) {
          return json({ error: 'Failed to fetch data from the API' }, { status: 500 });
        }
      }

export async function load() {
    const teamopts = { year: 2024 };  // Year filter

    const recordopts = { year: 2024 }

    try {
        // API call to get FBS Teams
        const teamsApi = new cfb.TeamsApi();

        const recordApi = new cfb.GamesApi()

        let teamdata = await teamsApi.getTeams(teamopts);

        teamdata = teamdata.filter(dp => (dp.mascot != undefined) && (dp.conference != undefined) && (dp.logos != undefined))

        teamdata = JSON.stringify(teamdata)

        const gamesApi = new cfb.GamesApi();
      
        let r = await gamesApi.getTeamRecords(recordopts)

        let records = {}
    
        r.forEach((team) => {records[team.team] = team})

        records = JSON.stringify(records)

        // console.log(records)

        // Return the fetched data to the frontend
        return {
            teamdata,
            records
        };
    } catch (error) {
        console.error('Error during API call:', error);

        // In case of an error, return a meaningful message

        return {
            error
        };
    }
}
