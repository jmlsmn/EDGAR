import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import routes from './routes';
import cacheFactory from './util/cacheFactory';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cacheFactory.init();

app.use('/filings', routes.filings);

app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}!`),
);
