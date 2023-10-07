import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { GuessResponseDto, ResumeGameResponseDto } from '../../../00-common/src/dto';
import { Either, ErrorResponse, Response, ValidResponse, LetterInfo } from '../../../00-common/src/types';

type WordleGameProps = {
    wordle: ResumeGameResponseDto
}

const getServerSideProps: GetServerSideProps<Either<WordleGameProps,{}>> = async (context) =>  {
    const id = context.params!.id as string;
    const response = await fetch(`http://localhost:8080/api/wordle/${id}`);
    const responseData = await response.json() as Response<ResumeGameResponseDto>;

    if ((responseData as ErrorResponse).error != null){
        context.res.statusCode = 307;
        context.res.setHeader('location','/wordle');
        context.res.end();
        return { props: {} }
    }

    const data = (responseData as ValidResponse<ResumeGameResponseDto>).data;

    return {
        props: {
            wordle: data
        }
    }
}

const Wordle: NextPage<WordleGameProps> = ({wordle}) => {
  const title = 'Wordle: Play Game';

  const [ guesses, setGuesses ] = useState(wordle.guesses);
  const [ guessesLeft, setGuessesleft ] = useState(wordle.guessesLeft);
  const [ gameStatus, setGameStatus ] = useState(wordle.gameStatus);
  const id = wordle.id;
  const wordlength = wordle.wordlength;

  const keyUp = (event: React.KeyboardEvent<HTMLInputElement>) =>{
    if(event.key !== 'Enter'){
        return;
    }

    fetch(`http://localhost:8080/api/wordle/${id}/guess`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({guess: event.currentTarget.value})
    }).then(async response => {
        const responseData = (await response.json()) as Response<GuessResponseDto>;
        if ((responseData as ErrorResponse).error != null){
            throw (responseData as ErrorResponse).error
        }

        const data = (responseData as ValidResponse<GuessResponseDto>).data;
        setGuesses([...guesses,data.hint]);
        setGuessesleft(data.guessesLeft);
        setGameStatus(data.gameStatus);
    }).catch(error=>{
        console.log(error);
    });

    event.currentTarget.value = '';
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
        {guesses.map((guess, yIndex) => (
            <div className="row" key={`guess-${yIndex}`}>
                {guess.map(({letter, status}, xIndex)=> (
                    <div className={status} key={`guess-${yIndex}-${xIndex}`}>
                    {letter}
                    </div> 
                ))}
            </div>
        ))}

        {Array.from(Array(guessesLeft)).map((_,yIndex) => (
            <div className="row" key={`left-guess-${yIndex}`}>
                {Array.from(Array(wordlength)).map((_,xIndex)=>(
                    <div key={`left-guess-${yIndex}-${xIndex}`}></div>
                ))}
            </div>
        ))}
        <input type="text" onKeyUp={keyUp}/>

        {gameStatus === 'open' && <p>Spiel ist offen</p>}
        {gameStatus === 'won' && <p>Spiel wurde gewonnen</p>}
        {gameStatus === 'lost' && <p>Spiel wurde verloren</p>}
      </main>

      <footer>
        &copy; impressive wordle Inc.
      </footer>
    </>
  );
}

export default Wordle;

export {
    getServerSideProps
}