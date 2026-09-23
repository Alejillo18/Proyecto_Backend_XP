import { UserService, ValidationError, ConflictError } from './UserService';

describe('UserService', () => {
  let mockRepository: any;
  let service: UserService;

  beforeEach(() => {
    const users: any[] = [];

    mockRepository = {
      findByEmail: async (email: string) => {
        return users.find(u => u.email === email) || null;
      },
      save: async (user: any) => {
        users.push(user);
        return user;
      }
    };

    service = new UserService(mockRepository as any);
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

  it('permite el login con credenciales correctas y devuelve un token', async () => {
    await service.register('a@correo.com', 'contraseñaValida123', 'Belgrano');
    const { user, token } = await service.login('a@correo.com', 'contraseñaValida123');
    
    expect(user.email).toBe('a@correo.com');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('rechaza el login con contraseña incorrecta', async () => {
    await service.register('a@correo.com', 'contraseñaValida123', 'Belgrano');
    await expect(service.login('a@correo.com', 'incorrecta')).rejects.toBeInstanceOf(ValidationError);
  });
});