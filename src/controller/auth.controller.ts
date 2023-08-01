import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { repository } from '../data-source';
import { Token } from '../entity/token.entity';
import { User } from '../entity/user.entity';

const SECRET_KEY: string = process.env.SECRET_KEY || 'dskyftbolevhpxmgnujc';
const userRepository = repository(User);
const tokenRepository = repository(Token);
class AuthController {
  static signUp = async (req: Request, res: Response) => {
    try {
      const { userName, email, password } = req.body;
      const user = new User();
      user.userName = userName;
      user.email = email;
      user.password = password;
      await userRepository.manager.transaction(async (manager) => {
        //  saving the user
        await userRepository.save(user);
        let token = jwt.sign({ id: user.id }, SECRET_KEY, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });
        const tokenData = new Token();
        tokenData.userId = user.id;
        tokenData.token = token;
        await tokenRepository.save(tokenData);
      });
      console.log('Saved a new user with id: ' + user.id);

      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(409).json({ errorCode: 409, errorMessage: 'Details are not correct' });
    }
  };
  static signIn = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      let user, token;
      await userRepository.manager.transaction(async (manager) => {
        user = await userRepository.findOneBy({ email: email });
        if (user) {
          const password_valid = password === user.password;
          if (password_valid) {
            token = jwt.sign({ id: user.id }, SECRET_KEY, {
              expiresIn: 1 * 24 * 60 * 60 * 1000,
            });
            const tokenData = new Token();
            tokenData.userId = user.id;
            tokenData.token = token;
            await tokenRepository.save(tokenData);
          }
        }
      });
      //send user data
      return res.status(201).json({ token: token, username: user.email, errorCode: 0, token_type: 'Bearer' });
    } catch (error) {}
  };
}

export default AuthController;
