import { randomUUID } from 'crypto';
import { Publication } from '../models';
import { MongoPublicationRepository } from '../repositories/MongoRepositories';
import { ValidationError } from './UserService';

export class PublicationService {
  constructor(private readonly publicationRepository: MongoPublicationRepository) {}

  // HU-01: Publicar una planta
  async publish(plantName: string, ownerId: string, barrio: string, photo?: string): Promise<Publication> {
    if (!plantName || plantName.trim().length === 0) {
      throw new ValidationError('El nombre de la planta es obligatorio');
    }

    const publication: Publication = {
      id: randomUUID(),
      plantName,
      photo,
      barrio,
      ownerId,
      status: 'Disponible',
    };

    await this.publicationRepository.save(publication);
    return publication;
  }

  // HU-03 / HU-04: Buscar y filtrar publicaciones
  async search(text: string, barrio?: string): Promise<Publication[]> {
    return await this.publicationRepository.search(text, barrio);
  }

  async getAll(): Promise<Publication[]> {
    return await this.publicationRepository.findAll();
  }

  async reserve(publicationId: string): Promise<void> {
    const publication = await this.publicationRepository.findById(publicationId);
    if (!publication) {
      throw new ValidationError('La publicación no existe');
    }
    publication.status = 'Reservado';
    await this.publicationRepository.update(publication);
  }

  // HU-02: Eliminar publicación propia
  async delete(publicationId: string, requesterId: string): Promise<void> {
    const publication = await this.getOwnedPublicationOrThrow(publicationId, requesterId, 'eliminar');
    await this.publicationRepository.delete(publication.id);
  }

  private async getOwnedPublicationOrThrow(publicationId: string, requesterId: string, action: 'editar' | 'eliminar'): Promise<Publication> {
    const publication = await this.publicationRepository.findById(publicationId);
    if (!publication) {
      throw new ValidationError('La publicación no existe');
    }
    if (publication.ownerId !== requesterId) {
      throw new ValidationError(`No podés ${action} una publicación que no es tuya`);
    }
    return publication;
  }
}