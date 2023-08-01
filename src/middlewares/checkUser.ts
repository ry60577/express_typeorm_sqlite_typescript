import { NextFunction, Request, Response } from 'express';
import { repository } from '../data-source';
import { User } from '../entity/user.entity';

const userRepository = repository(User);
export const checkUser = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { email, userName } = req.body;
    const userNameCheck = await userRepository.findOneBy({ userName: userName });
    //  if username exist in the database respond with a status of 409
    if (userNameCheck) {
      return res.status(409).json({ errorCode: 409, errorMessage: 'username already taken' });
    }
    const emailCheck = await userRepository.findOneBy({ email: email });
    if (emailCheck) {
      return res.status(409).json({ errorCode: 409, errorMessage: 'email already takend' });
    }
    next();
  };
};
