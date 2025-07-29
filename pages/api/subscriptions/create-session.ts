import { NextApiRequest, NextApiResponse } from 'next';
    import { createCheckoutSession } from '../../../server/controllers/subscription.controller';
    import { authenticateToken } from '../../../server/middleware/auth.middleware';

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
      if (req.method === 'POST') {
        await authenticateToken(req, res, async () => {
          await createCheckoutSession(req, res, () => {});
        });
      } else {
        res.status(405).json({ message: 'Method Not Allowed' });
      }
    }
