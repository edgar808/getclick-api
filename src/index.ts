import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Server } from 'http';
import { RoutingControllersOptions, useExpressServer } from 'routing-controllers';
import { Environment } from './config';
import { verify } from './middlewares/cors';
import { Database } from './modules/initializators';
import apiControllers from './controllers/api';
import adminControllers from './controllers/admin';
import { bearer, currentUserChecker, basic } from './middlewares/authCheckers';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const options: cors.CorsOptions = {
  origin: verify,
};

const controllerOptions: RoutingControllersOptions = {
  defaultErrorHandler: true,
  authorizationChecker: bearer,
  currentUserChecker,
};

app.options('*', cors(options));

useExpressServer(app, {
  routePrefix: '/api',
  controllers: apiControllers,
  defaultErrorHandler: true,
  ...controllerOptions,
});

useExpressServer(app, {
  routePrefix: '/admin',
  controllers: adminControllers,
  ...controllerOptions,
});

const database = new Database(Environment.DB_CONFIG.logging);

const start = (): Server => app
  .listen(Environment.PORT, () => console.log(`Server running on port ${Environment.PORT}`))
  .on('error', (err) => {
    if (err) throw err;
  });

database.init()
  .then(() => {
    start();
  });
