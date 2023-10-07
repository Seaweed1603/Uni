import type { NextPage } from 'next'
import Head from 'next/head';
import Link from 'next/link';

const Home: NextPage = () => {
  const title = 'Wordle: The Game';
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header>
        <h1>{title}</h1>
      </header>

      <nav>
        <Link href="/wordle">Neues Spiel starten</Link>
        <Link href="/impressum">Über uns</Link>
      </nav>
      <main>
       <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos possimus ullam amet ut nisi architecto atque in, laudantium, quibusdam fugit ipsa recusandae aliquid sit at cupiditate, tempore alias tempora doloremque!</p>
      </main>

      <footer>
        &copy; impressive wordle Inc.
      </footer>
    </>
  );
}

export default Home;