import type { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { NewGameResponseDto } from '../../../00-common/src/dto';
import { ErrorResponse, Response, ValidResponse } from '../../../00-common/src/types';

const NewWordle: NextPage = () => {
  const title = 'Wordle: New Game';

  const router = useRouter();

  const [ wordlength, setWordlength ] = useState(5);
  const [ maxGuessAmount, setMaxGuessAmount ] = useState(5);

  const updateWordlength: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setWordlength(+event.currentTarget.value);
  }
  const updateMaxGuessAmount: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setMaxGuessAmount(+event.currentTarget.value);
  }

  const startGame = async () => {

    const params = new URLSearchParams({
        wordlength: `${wordlength}`,
        maxGuessAmount: `${maxGuessAmount}`
    });

    const response = await fetch(`http://localhost:8080/api/wordle?${params}`);
    const responseData = (await response.json()) as Response<NewGameResponseDto>;

    if ((responseData as ErrorResponse).error != null){
        return console.error((responseData as ErrorResponse).error);
    }

    const data = (responseData as ValidResponse<NewGameResponseDto>).data;
    router.push(`/wordle/${data.id}`);
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header>
        <h1>{title}</h1>
      </header>

      <main>
       <label> 
        Wortlänge: 
        <input type="number" min="0" max="9" value={wordlength} onChange={updateWordlength}/>
       </label>
       <label> 
        Anzahl Versuche: 
        <input type="number" min="0" max="9" value={maxGuessAmount} onChange={updateMaxGuessAmount}/>
       </label>
       <button onClick={_ => startGame()}>
        Wordle starten
       </button>
      </main>

      <footer>
        &copy; impressive wordle Inc.
      </footer>
    </>
  );
}

export default NewWordle;