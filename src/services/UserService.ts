import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { User } from '../models';
import { MongoUserRepository } from '../repositories/MongoRepositories';


export class ValidationError extends Error {}
export class ConflictError extends Error {}

const MIN_PASSWORD_LENGTH = 8;
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro_para_desarrollo'; 

export class UserService {
  constructor(private readonly userRepository: MongoUserRepository) {}

  async register(email: string, password: string, barrio: string): Promise<User> {
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new ValidationError('La contraseña debe tener al menos 8 caracteres');
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user: User = {
      id: randomUUID(),
      email,
      passwordHash,
      barrio,
    };


    await this.userRepository.save(user);
    return user;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ValidationError('Email o contraseña incorrectos');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new ValidationError('Email o contraseña incorrectos');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '2h' }
    );

    return { user, token };
  }
}