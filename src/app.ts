import express, { Express } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv'; // Para leer variables de entorno

// 1. Importamos los repositorios de Mongo
import { 
  MongoUserRepository, 
  MongoPublicationRepository, 
  MongoExchangeOfferRepository 
} from './repositories/MongoRepositories';

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

dotenv.config();

export function createApp() {
  const userRepository = new MongoUserRepository();
  const publicationRepository = new MongoPublicationRepository();
  const offerRepository = new MongoExchangeOfferRepository();
  
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

  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Intercambios (Exchanges)',
        version: '1.0.0',
        description: 'Documentación de endpoints para usuarios, publicaciones e intercambios',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.ts'], 
  };

  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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