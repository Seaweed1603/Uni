import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { addGuess } from './actions';
import { connectToDatabase, DatabaseConfig } from './database';
import { createApiRouter } from './routes';

// TODO validate environment variables
// if ((process.env.PORT == null) || ((typeof +process.env.PORT) !== 'number')) {
//   throw new Error('Umgebungsvariable "PORT" nicht korrekt gesetzt.');
// }

const databaseConfig: DatabaseConfig = {
  uri: process.env.DB_URI!,
  database: process.env.DB_NAME!,
  dictionaryCollection: process.env.DB_COLLECTION_DICTIONARY!,
  gameCollection: process.env.DB_COLLECTION_GAME!
}

connectToDatabase(databaseConfig).then(async database => {
  
  try {

    if (process.env.DB_INIT! === 'true') {
      const wordsFile = process.env.WORDS_FILE!;
      const pathToFile = join( process.cwd(), 'data', wordsFile );
      const text = await readFile(pathToFile, { encoding: 'utf-8' });
      const words = text.split(/\r?\n/);
      await database.initDictionary(words);
    }

    const port = process.env.PORT!;
    const app = express();

    app.use(cors({ origin: '*' }));

    app.use('/static', express.static('public'));
    // app.use('/static', express.static('../02-client/build/static'));
    // app.use('/react', express.static('../02-client/build'));

    app.use(express.json());

    app.use('/api', await createApiRouter(database, addGuess));

    app.listen(port, () => {
      console.log(`Server ist listening on port ${port}.`);
    })

  } catch(error) {
    console.error(error);
    await database.close();
  }

}).catch(error => console.log(error));
