import { Router } from 'express';
import { AddGuessAction } from '../actions';
import { IDatabase } from '../database';
import { createWordleRouter } from './api';


export const createApiRouter = async (
  database: IDatabase, addGuess: AddGuessAction
): Promise<Router> => {
  
  const router = Router();

  router.use('/wordle', await createWordleRouter(database, addGuess));

  router.get('/date', (req, res) => {
    const date = (new Date).toString();
    res.status(200).send(date);
  })

  return router;
}