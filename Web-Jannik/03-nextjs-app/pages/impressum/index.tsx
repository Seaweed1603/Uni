import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'

type ImpressumProps = {
    name: string
}

const getStaticProps: GetStaticProps<ImpressumProps> = async () => {
    const name = 'Tommy Wiseau';
    return {
        props: {
            name
        }
    }
}

const Impressum: NextPage<ImpressumProps> = (props) => {
  const title = 'Impressum';
  const name = props.name;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header>
        <h1>{title}</h1>
      </header>
      <main>
       <p>Site was proudly designed by {name}</p>
      </main>

      <footer>
        &copy; impressive wordle Inc.
      </footer>
    </>
  )
}

export default Impressum

export {
    getStaticProps
}
