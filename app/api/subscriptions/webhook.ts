import { NextApiRequest, NextApiResponse } from 'next';
    import { stripeWebhook } from '../../../server/controllers/subscription.controller';
    import { buffer } from 'micro';

    export const config = {
      api: {
        bodyParser: false,
      },
    };

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
      if (req.method === 'POST') {
        const rawBody = await buffer(req);
        req.body = rawBody.toString(); // Assign the raw body to req.body
        await stripeWebhook(req, res, () => {});
      } else {
        res.status(405).json({ message: 'Method Not Allowed' });
      }
    }
