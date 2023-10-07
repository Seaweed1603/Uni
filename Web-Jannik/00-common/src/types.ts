export type Words = string[];
	 
export type LetterInfo = {
  letter: string,
  status: LetterStatus
}
 
export type LetterStatus = 'correct'
  | 'wrong-place'
  | 'incorrect';
 
export type GameStatus = 'open'
  | 'won'
  | 'lost';
 
export type Guess = LetterInfo[];
 
export enum ErrorType {
  // request errors
  ROUTE_NOT_FOUND,
  MISSING_PARAMETERS,
  WRONG_ARGUMENT,
 
  // server errors
  INTERNAL_SERVER_ERROR,
 
  // client errors
  GAME_NOT_FOUND,
  WRONG_WORD_LENGTH,
  NOT_A_WORD,
  GUESS_LIMIT_EXCEEDED,
  INVALID_OPERATION
}
 
export type ErrorInfo = {
  code: number,
  msg: string
}
 
export type Maybe<T> = null | T;
 
export type Either<T, S> = T | S;
 
export type ValidResponse<T> = {
  data: T
}
 
export type ErrorResponse = {
  error: string
}
 
export type Response<T> =
  Either<ValidResponse<T>, ErrorResponse>;