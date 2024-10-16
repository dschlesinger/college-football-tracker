import { json } from '@sveltejs/kit';
import cfb from 'cfb.js';
import 'dotenv/config';

const defaultClient = cfb.ApiClient.instance;
const ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
ApiKeyAuth.apiKey = `Bearer ${process.env.CFB_API_KEY}`;

// Define the GET handler
export async function POST({ request }) {
  try {

    const requestData = await request.json();

    let opts = {
        'team' : requestData.team,
        'year' : 2024
    }

    // Call the API using your Node package
    const apiInstance = new cfb.StatsApi();

    let data = await apiInstance.getTeamSeasonStats(opts)

    // Return the data in a JSON response
    return json(data);
  } catch (error) {
    return json({ error: 'Failed to fetch data from the API' }, { status: 500 });
  }
}