import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { useContainer, RoutingControllersOptions, useExpressServer } from 'routing-controllers';
import Container from 'typedi';
import { Server } from 'http';
import { Environment } from './config';
import { verify } from './middlewares/cors';
import { Database } from './modules/initializators';
import appControllers from './controllers/api';
import adminControllers from './controllers/admin';
import { bearer, currentUserChecker, basic } from './middlewares/authCheckers';
import { PaginatorInterceptor } from './middlewares/PaginatorInterceptor';

class ExpressServer {
  async init() {
    useContainer(Container);
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
      controllers: appControllers,
      interceptors: [PaginatorInterceptor],
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
  }
}

class App {
  async init() {
    useContainer(Container);
    const server = new ExpressServer();
    await server.init();
  }
}

const app = new App();

app.init().then(() => {
  console.info('The application was started! Kill it using Ctrl + C');
});
