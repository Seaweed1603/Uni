import { GameStatus, LetterInfo } from './types'
	 
export interface NewGameDto {
  wordlength: number,
  maxGuessAmount: number
}
 
export interface NewGameResponseDto {
  id: string,
  wordlength: number,
  guessesLeft: number,
  gameStatus: GameStatus
}
 
export interface ResumeGameDto {
  id: string
}
 
export type ResumeGameResponseDto = NewGameResponseDto & {
  guesses: LetterInfo[][]
};
 
export interface GuessDto {
  id: string,
  guess: string
}
 
export interface GuessResponseDto {
  hint: LetterInfo[],
  guessesLeft: number,
  gameStatus: GameStatus
}