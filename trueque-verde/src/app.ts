import express, { Express } from 'express';
import { UserRepository, PublicationRepository, ExchangeOfferRepository } from './repositories/InMemoryRepositories';
import { UserService } from './services/UserService';
import { PublicationService } from './services/PublicationService';
import { NotificationService } from './services/NotificationService';
import { ExchangeService } from './services/ExchangeService';
import { UserController } from './controllers/UserController';
import { PublicationController } from './controllers/PublicationController';
import { ExchangeController } from './controllers/ExchangeController';
import { createUserRoutes } from './routes/UserRoutes';
import { createPublicationRoutes } from './routes/PublicationRoutes';
import { createExchangeRoutes } from './routes/ExchangeRoutes';
import { performanceMiddleware } from './middlewares/performanceMiddleware';
export function createApp() {
  const userRepository = new UserRepository();
  const publicationRepository = new PublicationRepository();
  const offerRepository = new ExchangeOfferRepository();
  const notificationService = new NotificationService();
  const userService = new UserService(userRepository);
  const publicationService = new PublicationService(publicationRepository);
  const exchangeService = new ExchangeService(
    offerRepository,
    publicationRepository,
    publicationService,
    notificationService
  );
  const userController = new UserController(userService);
  const publicationController = new PublicationController(publicationService);
  const exchangeController = new ExchangeController(exchangeService);
  const app: Express = express();
  app.use(express.json());
  app.use(performanceMiddleware);
  app.use('/users', createUserRoutes(userController));
  app.use('/publications', createPublicationRoutes(publicationController));
  app.use('/exchanges', createExchangeRoutes(exchangeController));

  return {
    app,
    userRepository,
    publicationRepository,
    offerRepository,
    notificationService,
    userService,
    publicationService,
    exchangeService,
  };
}

export type AppContainer = ReturnType<typeof createApp>;