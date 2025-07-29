import { NextApiRequest, NextApiResponse } from 'next';
    import { getMe } from '../../../server/controllers/auth.controller';
    import { authenticateToken } from '../../../server/middleware/auth.middleware';

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
      if (req.method === 'GET') {
        await authenticateToken(req, res, async () => {
          await getMe(req, res, () => {});
        });
      } else {
        res.status(405).json({ message: 'Method Not Allowed' });
      }
    }
