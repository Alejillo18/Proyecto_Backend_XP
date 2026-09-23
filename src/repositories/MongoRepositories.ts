/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, Publication, ExchangeOffer } from '../models';
import { UserModel, PublicationModel, ExchangeOfferModel } from '../models/MongoModels';

export class MongoUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).lean();
  }

  async save(user: User): Promise<void> {
    await UserModel.create(user);
  }

  async clear(): Promise<void> {
    await UserModel.deleteMany({});
  }
}

export class MongoPublicationRepository {
  async save(publication: Publication): Promise<void> {
    await PublicationModel.create(publication);
  }

  async findById(id: string): Promise<Publication | null> {
    return PublicationModel.findOne({ id }).lean();
  }

  async findAll(): Promise<Publication[]> {
    return PublicationModel.find().lean();
  }

  async search(text: string, barrio?: string): Promise<Publication[]> {
    const query: any = {
      plantName: { $regex: text, $options: 'i' }
    };
    if (barrio) query.barrio = barrio;
    
    return PublicationModel.find(query).lean();
  }

  async update(publication: Publication): Promise<void> {
    await PublicationModel.updateOne({ id: publication.id }, publication);
  }

  async delete(id: string): Promise<void> {
    await PublicationModel.deleteOne({ id });
  }

  async clear(): Promise<void> {
    await PublicationModel.deleteMany({});
  }
}

export class MongoExchangeOfferRepository {
  async save(offer: ExchangeOffer): Promise<void> {
    await ExchangeOfferModel.create(offer);
  }

  async findById(id: string): Promise<ExchangeOffer | null> {
    return ExchangeOfferModel.findOne({ id }).lean();
  }

  async update(offer: ExchangeOffer): Promise<void> {
    await ExchangeOfferModel.updateOne({ id: offer.id }, offer);
  }

  async clear(): Promise<void> {
    await ExchangeOfferModel.deleteMany({});
  }
}