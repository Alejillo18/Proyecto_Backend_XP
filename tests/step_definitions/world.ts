/* eslint-disable @typescript-eslint/no-explicit-any */
import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { AppContainer } from '../../src/app';
import { Publication, User, ExchangeOffer } from '../../src/models';

import { 
  UserRepository, 
  PublicationRepository, 
  ExchangeOfferRepository 
} from '../../src/repositories/InMemoryRepositories';
import { UserService } from '../../src/services/UserService';
import { PublicationService } from '../../src/services/PublicationService';
import { ExchangeService } from '../../src/services/ExchangeService';
import { NotificationService } from '../../src/services/NotificationService';

export class TruequeVerdeWorld extends World {
  container: AppContainer;

  usersByName: Map<string, User> = new Map();
  publicationsByPlant: Map<string, Publication> = new Map();
  lastOffer?: ExchangeOffer;
  lastError?: Error;
  searchResults: Publication[] = [];
  searchMessage?: string;

  constructor(options: IWorldOptions) {
    super(options);

    const userRepository = new UserRepository();
    const publicationRepository = new PublicationRepository();
    const offerRepository = new ExchangeOfferRepository();

    const notificationService = new NotificationService();
    const userService = new UserService(userRepository as any);
    const publicationService = new PublicationService(publicationRepository as any);

    const exchangeService = new ExchangeService(
      offerRepository as any, 
      publicationRepository as any, 
      publicationService as any, 
      notificationService as any
    );

    this.container = {
      userRepository,
      publicationRepository,
      offerRepository,
      userService,
      publicationService,
      exchangeService,
      notificationService,
    } as unknown as AppContainer;
  }
}

setWorldConstructor(TruequeVerdeWorld);