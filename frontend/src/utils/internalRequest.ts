import axios, { AxiosRequestConfig } from 'axios';

export default async function internalRequest(url: string, method: string = 'GET', body: any = {}, headers: any = {}): Promise<[number, any]> {
    const options: AxiosRequestConfig = {
        method,
        url,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        data: body,
    };

    try {
        const response = await axios(options);
        return [response.status, response.data];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            return [error.response?.status ?? 500, error.response?.data ?? { message: 'Unknown error' }];
        } else {
            return [500, { message: error.message }];
        }
    }
}
