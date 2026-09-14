import express, { Express } from 'express';
import { UserRepository, PublicationRepository, ExchangeOfferRepository } from './repositories/InMemoryRepositories';
import { UserService } from './services/UserService';
import { PublicationService } from './services/PublicationService';
import { NotificationService } from './services/NotificationService';
import { ExchangeService } from './services/ExchangeService';
import { UserController } from './controllers/UserController';
import { PublicationController } from './controllers/PublicationController';
import { ExchangeController } from './controllers/ExchangeController';

// Diseño simple: un único "contenedor" manual de dependencias.
// Se expone para poder reutilizar los mismos repos/servicios en los tests de Cucumber.
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

  app.post('/users/register', userController.register);
  app.post('/users/login', userController.login);

  app.post('/publications', publicationController.publish);
  app.get('/publications/search', publicationController.search);
  app.delete('/publications/:id', publicationController.delete);

  app.post('/exchanges', exchangeController.propose);
  app.post('/exchanges/:id/accept', exchangeController.accept);
  app.post('/exchanges/:id/reject', exchangeController.reject);

  return {
    app,
    // se exponen para los step definitions de Cucumber (misma instancia que usa la app)
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
