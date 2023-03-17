import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const user = process.env.USERNAME;
const pass = process.env.PASSWORD;
const cluster = process.env.CLUSTER;
const dbname = process.env.DBNAME;

const connectStr = `mongodb+srv://${user}:${pass}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;

// Clear Warning
mongoose.set('strictQuery', true);

// Connect to the MongoDB cluster
mongoose
  .connect(connectStr, {})
  .then(() => {
    console.log('mongoose is connected');
  })
  .catch((err) => {
    console.log('ERROR:', err);
  });

export default mongoose.connection;