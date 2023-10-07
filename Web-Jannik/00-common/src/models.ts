import { Guess } from './types'
	 
export interface IDictionary {
  word: string
}
 
export interface IWordle {
  wordlength: number,
  maxGuessAmount: number,
  guesses: Guess[],
  word: string
}

export class Wordle implements IWordle {
  wordlength: number
  guesses: Guess[]
  word: string
  
  constructor(word: string, public maxGuessAmount: number) {
    this.wordlength = word.length;
    this.word = word;
    this.guesses = [];
  }
}
