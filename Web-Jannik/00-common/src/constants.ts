import { ErrorInfo, ErrorType } from './types';
	 
export const ErrorMessages: Record<ErrorType, ErrorInfo> = {
  [ErrorType.ROUTE_NOT_FOUND]: {
    code: 404,
    msg: 'Der Zugriffspunkt konnte nicht gefunden werden.'
  },
  [ErrorType.MISSING_PARAMETERS]: {
    code: 400,
    msg: 'Fehler beim Aufruf: es fehlen Parameter.'
  },
  [ErrorType.WRONG_ARGUMENT]: {
    code: 400,
    msg: 'Fehler beim Aufruf: Mind. ein Parameter ist ungültig.'
  },
  [ErrorType.INTERNAL_SERVER_ERROR]: {
    code: 500,
    msg: 'Ein unbekannter, interner Fehler ist aufgetreten.'
  },
  [ErrorType.GAME_NOT_FOUND]: {
    code: 404,
    msg: 'Spiel nicht gefunden.'
  },
  [ErrorType.WRONG_WORD_LENGTH]: {
    code: 400,
    msg: 'Das Wort hat die falsche Länge.'
  },
  [ErrorType.NOT_A_WORD]: {
    code: 400,
    msg: 'Das eingegebene Wort wurde nicht im Wörterbuch gefunden.'
  },
  [ErrorType.GUESS_LIMIT_EXCEEDED]: {
    code: 400,
    msg: 'Maximale Anzahl Versuche wurden bereits ausgeschöpft.'
  },
  [ErrorType.INVALID_OPERATION]: {
    code: 400,
    msg: 'Spielzug ist gegenwärtig nicht möglich.'
  }
}