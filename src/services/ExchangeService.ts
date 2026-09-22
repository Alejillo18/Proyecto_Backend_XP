import { randomUUID } from 'crypto';
import { ExchangeOffer } from '../models';
import { MongoExchangeOfferRepository, MongoPublicationRepository } from '../repositories/MongoRepositories';
import { ValidationError } from './UserService';
import { NotificationService } from './NotificationService';
import { PublicationService } from './PublicationService';

export class ExchangeService {
  constructor(
    private readonly offerRepository: MongoExchangeOfferRepository,
    private readonly publicationRepository: MongoPublicationRepository,
    private readonly publicationService: PublicationService,
    private readonly notificationService: NotificationService
  ) {}

  // HU-09: Proponer intercambio
  async propose(offeredPublicationId: string, targetPublicationId: string, fromUserId: string): Promise<ExchangeOffer> {
    const targetPublication = await this.publicationRepository.findById(targetPublicationId); // await
    if (!targetPublication) {
      throw new ValidationError('La publicación destino no existe');
    }

    if (targetPublication.ownerId === fromUserId) {
      throw new ValidationError('No podés proponer un intercambio sobre tu propia publicación');
    }

    const offer: ExchangeOffer = {
      id: randomUUID(),
      offeredPublicationId,
      targetPublicationId,
      fromUserId,
      toUserId: targetPublication.ownerId,
      status: 'Pendiente',
    };

    await this.offerRepository.save(offer);
    this.notificationService.notify(targetPublication.ownerId, `Nueva propuesta de intercambio por tu publicación`);
    return offer;
  }

  // HU-10: Aceptar propuesta
  async accept(offerId: string): Promise<ExchangeOffer> {
    const offer = await this.getOfferOrThrow(offerId);
    offer.status = 'Aceptada';
    await this.offerRepository.update(offer);
    await this.publicationService.reserve(offer.targetPublicationId);
    await this.publicationService.reserve(offer.offeredPublicationId);

    return offer;
  }

  // HU-10: Rechazar propuesta
  async reject(offerId: string): Promise<ExchangeOffer> {
    const offer = await this.getOfferOrThrow(offerId);
    offer.status = 'Rechazada';
    await this.offerRepository.update(offer);

    this.notificationService.notify(offer.fromUserId, 'Tu propuesta de intercambio fue rechazada');
    return offer;
  }

  private async getOfferOrThrow(offerId: string): Promise<ExchangeOffer> {
    const offer = await this.offerRepository.findById(offerId); // await
    if (!offer) {
      throw new ValidationError('La propuesta no existe');
    }
    return offer;
  }
}