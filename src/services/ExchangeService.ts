import { randomUUID } from 'crypto';
import { ExchangeOffer } from '../models';
import { ExchangeOfferRepository, PublicationRepository } from '../repositories/InMemoryRepositories';
import { ValidationError } from './UserService';
import { NotificationService } from './NotificationService';
import { PublicationService } from './PublicationService';

export class ExchangeService {
  constructor(
    private readonly offerRepository: ExchangeOfferRepository,
    private readonly publicationRepository: PublicationRepository,
    private readonly publicationService: PublicationService,
    private readonly notificationService: NotificationService
  ) {}

  // HU-09: Proponer intercambio
  propose(offeredPublicationId: string, targetPublicationId: string, fromUserId: string): ExchangeOffer {
    const targetPublication = this.publicationRepository.findById(targetPublicationId);
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

    this.offerRepository.save(offer);
    this.notificationService.notify(targetPublication.ownerId, `Nueva propuesta de intercambio por tu publicación`);
    return offer;
  }

  // HU-10: Aceptar propuesta
  accept(offerId: string): ExchangeOffer {
    const offer = this.getOfferOrThrow(offerId);
    offer.status = 'Aceptada';
    this.offerRepository.update(offer);

    this.publicationService.reserve(offer.targetPublicationId);
    this.publicationService.reserve(offer.offeredPublicationId);

    return offer;
  }

  // HU-10: Rechazar propuesta
  reject(offerId: string): ExchangeOffer {
    const offer = this.getOfferOrThrow(offerId);
    offer.status = 'Rechazada';
    this.offerRepository.update(offer);

    this.notificationService.notify(offer.fromUserId, 'Tu propuesta de intercambio fue rechazada');
    return offer;
  }

  private getOfferOrThrow(offerId: string): ExchangeOffer {
    const offer = this.offerRepository.findById(offerId);
    if (!offer) {
      throw new ValidationError('La propuesta no existe');
    }
    return offer;
  }
}
