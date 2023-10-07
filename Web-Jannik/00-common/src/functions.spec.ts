import { determineGameStatus } from './functions';
import { IWordle, Wordle } from './models';
import { GameStatus } from './types';
 
describe('Test: determine GameStatus', () => {
  it('should correctly determine an open wordle game', () => {
    const wordle: IWordle = new Wordle('coden', 5);
    const gameStatus = determineGameStatus(wordle);
    expect(gameStatus).toBe<GameStatus>('open');
  });
 
  it('should correctly determine a lost wordle game', () => {
    const wordle: IWordle = new Wordle('coden', 0);
    const gameStatus = determineGameStatus(wordle);
    expect(gameStatus).toBe<GameStatus>('lost');
  });
 
  it('should correctly determine a won wordle game', () => {
    const wordle: IWordle = new Wordle('coden', 1);
    wordle.guesses.push([
      { letter: 'c', status: 'correct' },
      { letter: 'o', status: 'correct' },
      { letter: 'd', status: 'correct' },
      { letter: 'e', status: 'correct' },
      { letter: 'n', status: 'correct' }
    ]);
    const gameStatus = determineGameStatus(wordle);
    expect(gameStatus).toBe<GameStatus>('won');
  });
});