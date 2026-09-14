import { randomUUID } from 'crypto';
import { Publication } from '../models';
import { PublicationRepository } from '../repositories/InMemoryRepositories';
import { ValidationError } from './UserService';

export class PublicationService {
  constructor(private readonly publicationRepository: PublicationRepository) {}

  // HU-01: Publicar una planta
  publish(plantName: string, ownerId: string, barrio: string, photo?: string): Publication {
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

    this.publicationRepository.save(publication);
    return publication;
  }

  // HU-03 / HU-04: Buscar y filtrar publicaciones
  search(text: string, barrio?: string): Publication[] {
    return this.publicationRepository.search(text, barrio);
  }

  getAll(): Publication[] {
    return this.publicationRepository.findAll();
  }

  reserve(publicationId: string): void {
    const publication = this.publicationRepository.findById(publicationId);
    if (!publication) {
      throw new ValidationError('La publicación no existe');
    }
    publication.status = 'Reservado';
    this.publicationRepository.update(publication);
  }

  // HU-02: Eliminar publicación propia
  delete(publicationId: string, requesterId: string): void {
    const publication = this.getOwnedPublicationOrThrow(publicationId, requesterId, 'eliminar');
    this.publicationRepository.delete(publication.id);
  }

  // REFACTOR: se extrae la validación de "dueño" para reutilizarla también en editar (HU-02)
  // sin duplicar la lógica de "no existe" / "no sos el dueño". El comportamiento externo
  // (los tests de Cucumber) no cambia, solo mejora la organización interna del código.
  private getOwnedPublicationOrThrow(publicationId: string, requesterId: string, action: 'editar' | 'eliminar'): Publication {
    const publication = this.publicationRepository.findById(publicationId);
    if (!publication) {
      throw new ValidationError('La publicación no existe');
    }
    if (publication.ownerId !== requesterId) {
      throw new ValidationError(`No podés ${action} una publicación que no es tuya`);
    }
    return publication;
  }
}
