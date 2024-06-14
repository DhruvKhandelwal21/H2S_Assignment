import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });
export default async (): Promise<any> => {
  // @ts-ignore
  console.log(process.env.PORT)
  const client = new MongoClient(process.env.DB_URI || '', {
    // useUnifiedTopology: true,
  });
  await client.connect();
  return client;
};