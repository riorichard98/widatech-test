import { NextApiRequest, NextApiResponse } from 'next';
import hitApi from '@/utils/hittingApi';

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const wida_service = process.env.wida_service || ''
    try {
        const [httpStatus, response] = await hitApi(wida_service+"/products", ["POST"], req)
        res.status(httpStatus).json(response)
      } catch (error) {
        console.error('Error forwarding request:', error);
        res.status(500).json({ error: 'Something went wrong' });
      }
}