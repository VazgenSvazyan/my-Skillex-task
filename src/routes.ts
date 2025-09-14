import { Express } from 'express';
import CombinationRouter from './routes/combination';

export default (app: Express) => {
  app.use('/combination', CombinationRouter);
};
