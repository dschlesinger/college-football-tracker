
import { error } from '@sveltejs/kit';
import cfb from 'cfb.js';
import 'dotenv/config';

const defaultClient = cfb.ApiClient.instance;
const ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
ApiKeyAuth.apiKey = `Bearer ${process.env.CFB_API_KEY}`;

const apiInstance = new cfb.TeamsApi();

export async function load() {
    const opts = { year: 2024 };  // Year filter

    try {
        // API call to get FBS Teams
        let data = await apiInstance.getFbsTeams(opts);
        console.log('API called successfully. Returned data:', typeof data);

        console.log(data[0].id)

        data = JSON.stringify(data)
        
        // Return the fetched data to the frontend
        return {
            data
        };
    } catch (error) {
        console.error('Error during API call:', error);

        // In case of an error, return a meaningful message

        return {
            error
        };
    }
}
