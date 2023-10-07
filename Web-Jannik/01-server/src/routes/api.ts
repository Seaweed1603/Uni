import { Router, Request } from 'express';
import { AddGuessAction } from '../actions';
import { IDatabase } from '../database';
import { GuessDto, GuessResponseDto, NewGameDto, NewGameResponseDto, ResumeGameDto, ResumeGameResponseDto } from '../../../00-common/src/dto';
import { ErrorMessages } from '../../../00-common/src/constants';
import { ErrorType, Response } from '../../../00-common/src/types';
import { Wordle } from '../../../00-common/src/models';
import { determineGameStatus, determineGuessesLeft } from '../../../00-common/src/functions';


export const createWordleRouter = async (
  database: IDatabase, addGuess: AddGuessAction
): Promise<Router> => {
  
  const router = Router();

  // create new game
  router.get('/', async (req: Request<{}, Response<NewGameResponseDto>, {}, NewGameDto>, res) => {

    const wordlength =
      (req.query.wordlength == null) || (isNaN(+req.query.wordlength))
        ? +process.env.WORDLE_DEFAULT_WORDLENGTH!
        : +req.query.wordlength;

    const maxGuessAmount =
    (req.query.maxGuessAmount == null) || (isNaN(+req.query.maxGuessAmount))
      ? +process.env.WORDLE_DEFAULT_MAX_GUESS_AMOUNT!
      : +req.query.maxGuessAmount;

    const word = await database.getRandomWord(wordlength);
    if (word == null) {
      const { code, msg } = ErrorMessages[ErrorType.INTERNAL_SERVER_ERROR];
      return res.status(code).send({ error: msg });
    }

    const wordle = new Wordle(word, maxGuessAmount);
    const id = await database.insertWordle(wordle);

    return res.status(200).send({ data: {
      id, wordlength, guessesLeft: maxGuessAmount, gameStatus: 'open'
    }})
  });
  
  // resume game
  router.get('/:id', async (req: Request<ResumeGameDto, Response<ResumeGameResponseDto>, {}, {}>, res) => {

    const id = req.params.id;

    if ((typeof id !== 'string') || (id.length === 0)){
      const { code, msg } = ErrorMessages[ErrorType.WRONG_ARGUMENT];
      return res.status(code).send({ error: msg });
    }

    const wordle = await database.findWordle(id);
    if (wordle == null) {
      const { code, msg } = ErrorMessages[ErrorType.GAME_NOT_FOUND];
      return res.status(code).send({ error: msg });
    }

    return res.status(200).send({ data: {
      id,
      wordlength: wordle.wordlength,
      guessesLeft: determineGuessesLeft(wordle),
      gameStatus: determineGameStatus(wordle),
      guesses: wordle.guesses
    }});

  });
  
  // add guess
  type GuessDtoParams = Pick<GuessDto, 'id'>;
  type GuessDtoBody = Pick<GuessDto, 'guess'>;
  router.post('/:id/guess', async (req: Request<GuessDtoParams, Response<GuessResponseDto>, GuessDtoBody, {}>, res) => {

    if ((req.body.guess == null) || (typeof req.body.guess != 'string')) {
      const { code, msg } = ErrorMessages[ErrorType.WRONG_ARGUMENT];
      return res.status(code).send({ error: msg });
    }

    const result = await addGuess(database, req.params.id, req.body.guess);
    if (typeof result == 'number') {
      const { code, msg } = ErrorMessages[result];
      return res.status(code).send({ error: msg });
    }

    return res.status(200).send({ data: result });
  });

  return router;
}