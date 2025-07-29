import jwt from 'jsonwebtoken';

    export const generateToken = (userId: string, email: string) => {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in .env');
      }
      return jwt.sign({ userId, email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
    };

    export const verifyToken = (token: string) => {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in .env');
      }
      try {
        return jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return null;
      }
    };
