import dotenv from 'dotenv';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// Import the db connection
import db from '../database/index';

dotenv.config();
const app = express();

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// connect to db
db.once('open', () => {
  return;
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// ----  Routes ---- //

// ---- Catch all for routing ---- //

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'), (err: Error) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// ---- Set Port and Listen For Requests ---- //

const port = 8080;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
