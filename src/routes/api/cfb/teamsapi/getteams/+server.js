import { json } from '@sveltejs/kit';
import cfb from 'cfb.js';
import 'dotenv/config';

const defaultClient = cfb.ApiClient.instance;
const ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
ApiKeyAuth.apiKey = `Bearer ${process.env.CFB_API_KEY}`;

var teamsApi = new cfb.TeamsApi();

// teamsapi/getteams

export async function GET() {

    try {
    
        let opts = {

        }

        let teamdata = await teamsApi.getTeams(opts);

        teamdata = teamdata.filter(dp => (dp.mascot != undefined) && (dp.conference != undefined) && (dp.logos != undefined))

        let teams = {}
    
        teamdata.forEach((team) => {teams[team.team] = team})

        teamdata = JSON.stringify(teamdata)
    
        // Return the data in a JSON response
        return json(teamdata);
      } catch (error) {
        return json({ error: `Failed to fetch data from the API ${error}` }, { status: 500 });
      }

    }
