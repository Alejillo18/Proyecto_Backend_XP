import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { createApp, AppContainer } from '../../src/app';
import { Publication, User, ExchangeOffer } from '../../src/models';

export class TruequeVerdeWorld extends World {
  container: AppContainer;

  // estado auxiliar para pasar datos entre steps Given/When/Then
  usersByName: Map<string, User> = new Map();
  publicationsByPlant: Map<string, Publication> = new Map();
  lastOffer?: ExchangeOffer;
  lastError?: Error;
  searchResults: Publication[] = [];
  searchMessage?: string;

  constructor(options: IWorldOptions) {
    super(options);
    this.container = createApp();
  }
}

setWorldConstructor(TruequeVerdeWorld);
