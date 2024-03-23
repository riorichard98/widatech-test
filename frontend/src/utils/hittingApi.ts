import { NextApiRequest } from 'next';
import axios, { AxiosRequestConfig } from 'axios';

export default async function hitApi(serviceUrl: string, allowedMethods: string[], req: NextApiRequest): Promise<[number, any]> {
    const { query, headers, method, body } = req;

    // Verify only the method allowed
    if (!allowedMethods.includes(method as string)) {
        return [403, { message: "method not allowed" }]
    }

    // Convert query object to URLSearchParams
    const queryParams = new URLSearchParams(query as Record<string, string>).toString();
    const apiUrl = queryParams ? `${serviceUrl}?${queryParams}` : serviceUrl;

    // Define request options
    const options: AxiosRequestConfig = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers, // Include additional headers if provided
        },
        data: body, // Set request body
    };

    try {
        // Send request using Axios
        const response = await axios(apiUrl, options);
        return [response.status, response.data];
    } catch (error:any) {
        // Handle errors
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            return [error.response.status, error.response.data];
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in Node.js
            return [500, { message: 'No response received' }];
        } else {
            // Something happened in setting up the request that triggered an Error
            return [500, { message: error.message }];
        }
    }
}
