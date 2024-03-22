import { IncomingMessage } from 'http';
import * as http from 'https';

interface HttpResponse {
    status: number;
    data: any;
}

export function request(url: string, method: string = 'GET', params: Record<string, string | number> = {}, body?: any, options: http.RequestOptions = {}): Promise<HttpResponse> {
    // Check if the second parameter is an object, otherwise use an empty object
    if (typeof params !== 'object') {
        params = {};
    }

    // Build query string from params object
    const queryString: string = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    // Append query string to the URL if params exist
    const apiUrl: string = params ? `${url}?${queryString}` : url;

    // Make an HTTP request
    const requestOptions: http.RequestOptions = {
        method,
        headers: {
            'Content-Type': 'application/json',
            // Add any additional headers if needed
        },
        ...options
    };

    return new Promise((resolve, reject) => {
        const req = http.request(apiUrl, requestOptions, (res: IncomingMessage) => {
            let data: string = '';

            // A chunk of data has been received.
            res.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received.
            res.on('end', () => {
                try {
                    // Parse the received data (assuming it's JSON)
                    const jsonData = JSON.parse(data);
                    const httpResponse: HttpResponse = {
                        status: res.statusCode || 500,
                        data: jsonData,
                    };
                    resolve(httpResponse);
                } catch (error) {
                    reject(new Error('Error parsing JSON: ' + (error as Error).message));
                }
            });
        });

        // Handle errors in the request
        req.on('error', (error) => {
            reject(new Error('Request error: ' + error.message));
        });

        // Add the request body if provided
       // Add the request body if provided
       if (body) {
        if (body instanceof FormData) {
            // Handle FormData
            const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);
            if (requestOptions.headers) requestOptions.headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;

            for (const [key, value] of body.entries()) {
                req.write(`--${boundary}\r\n`);
                req.write(`Content-Disposition: form-data; name="${key}"\r\n\r\n`);
                req.write(`${value}\r\n`);
            }
            req.write(`--${boundary}--\r\n`);
        } else {
            // For other types of bodies, write the body to the request
            const requestBody = JSON.stringify(body);
            if (requestOptions.headers) requestOptions.headers['Content-Length'] = Buffer.from(requestBody).length.toString();
            req.write(requestBody);
        }
    }

        // End the request
        req.end();
    });
}