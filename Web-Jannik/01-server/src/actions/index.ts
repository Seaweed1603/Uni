import { IWordle } from '../../../00-common/src/models';
import { determineGameStatus, determineGuessesLeft } from '../../../00-common/src/functions';
import { Either, ErrorType, GameStatus, LetterInfo } from '../../../00-common/src/types';
import { IDatabase } from '../database';


export type AddGuessAction = (
  database: IDatabase, id: string, guess: string
) => Promise<AddGuessResult>;

export type AddGuessResult = Either<ErrorType, {
  hint: LetterInfo[],
  guessesLeft: number,
  gameStatus: GameStatus
}>;

export const addGuess: AddGuessAction = async (database, id, guess) => {

  guess = guess.toUpperCase();

  const wordle = await database.findWordle(id);
  if (wordle == null) {
    return ErrorType.GAME_NOT_FOUND;
  }
  if (guess.length !== wordle.wordlength) {
    return ErrorType.WRONG_WORD_LENGTH;
  }
  if (wordle.guesses.length >= wordle.maxGuessAmount) {
    return ErrorType.GUESS_LIMIT_EXCEEDED;
  }

  const wordExists = await database.wordExists(guess);
  if (!wordExists) {
    return ErrorType.NOT_A_WORD;
  }

  const wordInfo = guess.split('')
    .map<LetterInfo>((letter, index) => {
      if (letter === wordle.word[index]) {
        return { letter, status: 'correct' }
      }
      // TODO: Buchstabe, das nur einmal vorkommt, könnt mehrmals Mal erkannt werden, Suchwort: INSEL, Ratewort: EEEEE
      if (wordle.word.includes(letter)) {
        return { letter, status: 'wrong-place' }
      }
      return { letter, status: 'incorrect' }
    });

  await database.insertGuess(id, wordInfo);
  wordle.guesses.push(wordInfo);

  return {
    hint: wordInfo,
    guessesLeft: determineGuessesLeft(wordle),
    gameStatus: determineGameStatus(wordle)
  }
}
