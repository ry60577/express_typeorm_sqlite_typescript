import express from 'express';
import { runSeeders } from 'typeorm-extension';
import { dataSource } from './data-source';
import routes from './routes';

const PORT = process.env.PORT || 9001;

(async () => {
  dataSource
    .initialize()
    .then(async () => {
      console.log('Data Source has been initialized!');
      runSeeders(dataSource, {
        seeds: ['dist/seeds/*.js'],
        factories: ['dist/factories/*.js'],
      });
      //  Create and set express app
      const app = express();

      //  middleware
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      app.use('/', routes);

      //  Start express server
      app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
    })
    .catch((error) => console.log(error));
})();
