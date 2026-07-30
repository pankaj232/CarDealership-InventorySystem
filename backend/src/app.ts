import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import routes from './routes';
import { domainErrorHandler } from './middleware/domain-error.handler';
import { errorHandler } from './middleware/error.handler';

const app: Application = express();

app.use(helmet());
app.use(cors());

if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
app.use(domainErrorHandler);
app.use(errorHandler);

export default app;
