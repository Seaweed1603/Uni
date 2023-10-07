import { IWordle } from './models';
import { GameStatus } from './types';
  
export const determineGameStatus =
  (wordle: IWordle): GameStatus =>
{
  const lastGuess = wordle.guesses.at(-1) || [];
  const correctLetters = lastGuess
    .filter(info => info.status === 'correct').length;
  
  if (correctLetters === wordle.wordlength) {
    return 'won';
  } else if (wordle.guesses.length < wordle.maxGuessAmount) {
    return 'open';
  }
  return 'lost';
}
  
export const determineGuessesLeft =
  (wordle: IWordle): number =>
{
  return Math.max(
    0,
    wordle.maxGuessAmount - wordle.guesses.length
  );
}