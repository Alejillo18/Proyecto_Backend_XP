import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from '../models';
import { UserRepository } from '../repositories/InMemoryRepositories';

export class ValidationError extends Error {}
export class ConflictError extends Error {}

const MIN_PASSWORD_LENGTH = 8;
const SALT_ROUNDS = 10;

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // HU-05: Registro de usuario
  async register(email: string, password: string, barrio: string): Promise<User> {
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new ValidationError('La contraseña debe tener al menos 8 caracteres');
    }

    if (this.userRepository.findByEmail(email)) {
      throw new ConflictError('El email ya está registrado');
    }

    // HU-14: hashing + salting con bcrypt, nunca texto plano
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user: User = {
      id: randomUUID(),
      email,
      passwordHash,
      barrio,
    };

    this.userRepository.save(user);
    return user;
  }

  // HU-06: Inicio de sesión
  async login(email: string, password: string): Promise<User> {
    const user = this.userRepository.findByEmail(email);
    if (!user) {
      throw new ValidationError('Email o contraseña incorrectos');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new ValidationError('Email o contraseña incorrectos');
    }

    return user;
  }
}
