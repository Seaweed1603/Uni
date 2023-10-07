import { Collection, Db, MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { LetterInfo, Maybe } from '../../../00-common/src/types';
import { IDictionary, IWordle } from '../../../00-common/src/models';
  
  
export interface IDatabase {
  close(): Promise<void>
  initDictionary(text: string[]): Promise<void>
  getRandomWord(wordlength: number): Promise<Maybe<string>>
  insertWordle(wordle: IWordle): Promise<id>
  findWordle(id: string): Promise<Maybe<IWordle>>
  wordExists(word: string): Promise<boolean>
  insertGuess(id: string, guess: LetterInfo[]): Promise<void>
}
  
export type id = string
  
type Collections = {
  dictionary: Collection<IDictionary>
  game: Collection<IWordle>
}
  
export type DatabaseConfig = {
  uri: string,
  database: string,
  dictionaryCollection: string,
  gameCollection: string
}

class Database implements IDatabase {
  
  constructor(
    private client: MongoClient,
    private db: Db,
    private collections: Collections
  )
  { }

  close(): Promise<void> {
    return this.client.close();
  }

  async initDictionary(text: string[]): Promise<void> {
    await this.collections.dictionary.deleteMany({});
    const data = text.map<IDictionary>(word => ({ word: word.toUpperCase() }));
    await this.collections.dictionary.insertMany(data);
  }

  async getRandomWord(wordlength: number): Promise<Maybe<string>> {
    
    const result = await this.collections.dictionary.find({
      word: { $regex: new RegExp(`^[\\w]{${wordlength}}$`) }
    }).toArray();

    if ((result == null) || (result.length === 0)) {
      return null;
    }
    
    const index = Math.floor(Math.random() * result.length);
    return result[index].word;
  }
  
  async insertWordle(wordle: IWordle): Promise<string> {
    const result = await this.collections.game.insertOne(wordle);

    return result.insertedId.toString();
  }

  async findWordle(id: string): Promise<Maybe<IWordle>> {
    try {
      return await this.collections.game.findOne({ _id: new ObjectId(id) });
    } catch(error) {
      console.error(error);
      return null;
    }
  }

  async wordExists(word: string): Promise<boolean> {
    const result = await this.collections.dictionary.findOne({ word });

    return result != null;
  }

  async insertGuess(id: string, guess: LetterInfo[]): Promise<void> {
    await this.collections.game.updateOne({
      _id: new ObjectId(id)
    }, {
      $push: { guesses: guess }
    });
  }

}



export async function connectToDatabase(
  config: DatabaseConfig
): Promise<IDatabase> {

  const client = new MongoClient(
    config.uri,
    { serverApi: ServerApiVersion.v1 }
  )
  await client.connect();

  const db = client.db(config.database);
  const collections: Collections = {
    dictionary: db.collection<IDictionary>(config.dictionaryCollection),
    game: db.collection<IWordle>(config.gameCollection)
  }

  return new Database(client, db, collections);
}
