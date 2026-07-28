import app from './app';
import config from './config';

const startServer = (): void => {
  app.listen(config.port, () => {
    console.log(
      `Server running in ${config.nodeEnv} mode on port ${config.port}`
    );
  });
};

startServer();
