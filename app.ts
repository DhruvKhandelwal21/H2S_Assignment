import express from "express";
import cors from "cors";
import mongoConnect from "./src/db";
import * as dotenv from "dotenv";
import routes from "./src/routes";
import errorHandler from "./src/middleWare/errorHandler";
dotenv.config();

const app = express();
app.use(express.json({limit: "20kb"}));
// cors enabled for all routes and can recieved request from any origin as of now.
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});
// middleware to use all the routes present in route module
// We can utilise routes with more freedom as we can use different auth middleware
// for different route or not at all depending upon requirement.

// used MVC architecture along with separating business or DB
// related logic to the services file so that we can also utlise them
// if required.
app.use(routes);
app.use(errorHandler)
const database = async () => {
  const client = await mongoConnect();
  app.locals.db = client.db();
  app.locals.client = client;
};
database().then(() => {
  // tslint:disable-next-line:no-console
  console.log("Database connected");
});

const server = app.listen(process.env.PORT || 4000, () => {
  console.log(`server started on port ${process.env.PORT}`);
});

// server();