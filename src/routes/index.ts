import express from 'express';
import authRouter from './auth.route';

const routes = express();

routes.use('/api/users', authRouter);

export default routes;
