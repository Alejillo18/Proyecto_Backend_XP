
import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { TruequeVerdeWorld } from './world';

Given('no existe ningún usuario con email {string}', async function (this: TruequeVerdeWorld, email: string) {
  const existing = await this.container.userRepository.findByEmail(email);
  assert.ok(!existing);
});

Given('ya existe un usuario registrado con email {string}', async function (this: TruequeVerdeWorld, email: string) {
  try {
    await this.container.userService.register(email, 'contraseñaValida123', 'Belgrano');
  } catch (err) {
    // Si ya existe por una prueba anterior, lo ignoramos
  }
});

When(
  'me registro con email {string}, contraseña {string} y barrio {string}',
  async function (this: TruequeVerdeWorld, email: string, password: string, barrio: string) {
    try {
      await this.container.userService.register(email, password, barrio);
    } catch (err) {
      this.lastError = err as Error;
    }
  }
);

Then('el registro debe ser exitoso', function (this: TruequeVerdeWorld) {
  assert.equal(this.lastError, undefined);
});

Then('el usuario {string} debe existir en el sistema', async function (this: TruequeVerdeWorld, email: string) {
  const user = await this.container.userRepository.findByEmail(email);
  assert.ok(user);
});

Then('el registro debe fallar con el error {string}', function (this: TruequeVerdeWorld, expectedMessage: string) {
  assert.notEqual(this.lastError, undefined);
  assert.equal(this.lastError?.message, expectedMessage);
});