import { Request, Response, NextFunction } from 'express';
    import jwt from 'jsonwebtoken';

    interface AuthenticatedRequest extends Request {
      user?: {
        userId: string;
        email: string;
      };
    }

    export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
        if (err) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
      });
    };
