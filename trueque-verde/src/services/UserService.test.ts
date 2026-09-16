import { UserService, ValidationError, ConflictError } from './UserService';
import { UserRepository } from '../repositories/InMemoryRepositories';

describe('UserService', () => {
  let repository: UserRepository;
  let service: UserService;

  beforeEach(() => {
    repository = new UserRepository();
    service = new UserService(repository);
  });

  it('registra un usuario válido y guarda la contraseña hasheada (no en texto plano)', async () => {
    const user = await service.register('a@correo.com', 'contraseñaValida123', 'Belgrano');
    expect(user.email).toBe('a@correo.com');
    expect(user.passwordHash).not.toBe('contraseñaValida123');
  });

  it('rechaza contraseñas de menos de 8 caracteres', async () => {
    await expect(service.register('a@correo.com', '123', 'Belgrano')).rejects.toBeInstanceOf(ValidationError);
  });

  it('rechaza el registro si el email ya existe', async () => {
    await service.register('a@correo.com', 'contraseñaValida123', 'Belgrano');
    await expect(service.register('a@correo.com', 'otraClave123', 'Palermo')).rejects.toBeInstanceOf(ConflictError);
  });

  it('permite el login con credenciales correctas', async () => {
    await service.register('a@correo.com', 'contraseñaValida123', 'Belgrano');
    const user = await service.login('a@correo.com', 'contraseñaValida123');
    expect(user.email).toBe('a@correo.com');
  });

  it('rechaza el login con contraseña incorrecta', async () => {
    await service.register('a@correo.com', 'contraseñaValida123', 'Belgrano');
    await expect(service.login('a@correo.com', 'incorrecta')).rejects.toBeInstanceOf(ValidationError);
  });
});
