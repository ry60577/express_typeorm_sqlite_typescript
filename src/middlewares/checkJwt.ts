import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  console.log('checkJwt');
  const token: string = req.headers['authorization'].split(' ')[1];

  try {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.body = decoded;
    next();
  } catch (error) {
    const { message } = error;
    return res.status(401).json({ errorCode: 401, errorMessage: message });
  }
};
