export interface User {
  id: string;
  email: string;
  passwordHash: string;
  barrio: string; // HU-16: solo barrio, nunca dirección/coordenadas exactas
}

export type PublicationStatus = 'Disponible' | 'Reservado';

export interface Publication {
  id: string;
  plantName: string;
  photo?: string; // si no se define, el frontend debe mostrar ícono genérico
  barrio: string;
  ownerId: string;
  status: PublicationStatus;
}

export type OfferStatus = 'Pendiente' | 'Aceptada' | 'Rechazada';

export interface ExchangeOffer {
  id: string;
  targetPublicationId: string; // publicación que se quiere obtener
  offeredPublicationId: string; // publicación que se ofrece a cambio
  fromUserId: string;
  toUserId: string;
  status: OfferStatus;
}
