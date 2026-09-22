import mongoose, { Schema } from 'mongoose';
import { User, Publication, ExchangeOffer } from './index';

const userSchema = new Schema<User>({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  barrio: { type: String, required: true }
}, { versionKey: false });

export const UserModel = mongoose.model<User>('User', userSchema);

const publicationSchema = new Schema<Publication>({
  id: { type: String, required: true, unique: true },
  plantName: { type: String, required: true },
  photo: { type: String, required: false },
  barrio: { type: String, required: true },
  ownerId: { type: String, required: true },
  status: { type: String, enum: ['Disponible', 'Reservado'], default: 'Disponible' }
}, { versionKey: false });

export const PublicationModel = mongoose.model<Publication>('Publication', publicationSchema);

const exchangeOfferSchema = new Schema<ExchangeOffer>({
  id: { type: String, required: true, unique: true },
  targetPublicationId: { type: String, required: true },
  offeredPublicationId: { type: String, required: true },
  fromUserId: { type: String, required: true },
  toUserId: { type: String, required: true },
  status: { type: String, enum: ['Pendiente', 'Aceptada', 'Rechazada'], default: 'Pendiente' }
}, { versionKey: false });

export const ExchangeOfferModel = mongoose.model<ExchangeOffer>('ExchangeOffer', exchangeOfferSchema);