import { ExchangeOffer, Publication, User } from '../models';

/**
 * Repositorios en memoria. Diseño simple (YAGNI): alcanza para BDD/tests
 * y se puede reemplazar por Prisma/TypeORM sin tocar los servicios,
 * ya que exponen la misma interfaz.
 */
export class UserRepository {
  private users: Map<string, User> = new Map();

  findByEmail(email: string): User | undefined {
    return [...this.users.values()].find((u) => u.email === email);
  }

  save(user: User): void {
    this.users.set(user.id, user);
  }

  clear(): void {
    this.users.clear();
  }
}

export class PublicationRepository {
  private publications: Map<string, Publication> = new Map();

  save(publication: Publication): void {
    this.publications.set(publication.id, publication);
  }

  findById(id: string): Publication | undefined {
    return this.publications.get(id);
  }

  findByPlantName(plantName: string): Publication | undefined {
    return [...this.publications.values()].find((p) => p.plantName === plantName);
  }

  findAll(): Publication[] {
    return [...this.publications.values()];
  }

  search(text: string, barrio?: string): Publication[] {
    const lowerText = text.toLowerCase();
    return this.findAll().filter((p) => {
      const matchesText = p.plantName.toLowerCase().includes(lowerText);
      const matchesBarrio = barrio ? p.barrio === barrio : true;
      return matchesText && matchesBarrio;
    });
  }

  update(publication: Publication): void {
    this.publications.set(publication.id, publication);
  }

  delete(id: string): void {
    this.publications.delete(id);
  }

  clear(): void {
    this.publications.clear();
  }
}

export class ExchangeOfferRepository {
  private offers: Map<string, ExchangeOffer> = new Map();

  save(offer: ExchangeOffer): void {
    this.offers.set(offer.id, offer);
  }

  findById(id: string): ExchangeOffer | undefined {
    return this.offers.get(id);
  }

  findLatestByPublications(offeredPublicationId: string, targetPublicationId: string): ExchangeOffer | undefined {
    return [...this.offers.values()]
      .reverse()
      .find(
        (o) => o.offeredPublicationId === offeredPublicationId && o.targetPublicationId === targetPublicationId
      );
  }

  update(offer: ExchangeOffer): void {
    this.offers.set(offer.id, offer);
  }

  clear(): void {
    this.offers.clear();
  }
}
