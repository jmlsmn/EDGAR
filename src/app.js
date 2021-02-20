import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'path';
import routes from './routes';
import cacheFactory from './util/cacheFactory';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cacheFactory.init();

/**
 * REST API
 */
app.use('/filings', routes.filings);

/**
 * Static Files
 */
app.use('/', express.static('src'));

// Default every route except the above to serve the index.html
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/index.html'));
});

app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}!`),
);
