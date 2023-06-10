import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { logger } from "../logger";
import { app } from "../../app";

dotenv.config();

const MONGO_PORT = process.env.MONGO_PORT || 7000;

export const generateMongoUri = () => {
  const MONGO_USERNAME = process.env.MONGO_USERNAME || "local_username";
  const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "local_password";
  const MONGO_CLUSTER = process.env.MONGO_CLUSTER || "";

  return `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.0mwsj.mongodb.net/memoryGame?retryWrites=true&w=majority`;
};

export const initMongo = () => {
  const mongoOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: false,
  };
  mongoose.connect(generateMongoUri(), mongoOptions);

  const db = mongoose.connection;

  db.on("error", (err) => logger.error("MONGO ERROR", err));
  db.once("open", () => {
    app.listen(MONGO_PORT, () => {
      logger.info("Connected successfully to MongoDB");
      logger.info(`MONGO is running on port ${MONGO_PORT}`);
    });
  });
};
