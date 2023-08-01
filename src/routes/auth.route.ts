import { Router } from 'express';
import AuthController from '../controller/auth.controller';
import { checkUser } from '../middlewares/checkUser';

const authRouter = Router();

// Signup route
authRouter.post('/signup', checkUser(), AuthController.signUp);
authRouter.post('/signin', AuthController.signIn);

export default authRouter;
