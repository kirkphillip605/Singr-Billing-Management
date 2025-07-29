import { NextApiRequest, NextApiResponse } from 'next';
    import { register } from '../../../server/controllers/auth.controller';

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
      if (req.method === 'POST') {
        await register(req, res, () => {});
      } else {
        res.status(405).json({ message: 'Method Not Allowed' });
      }
    }
