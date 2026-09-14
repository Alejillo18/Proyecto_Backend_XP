import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { TruequeVerdeWorld } from './world';

Given('{string} está registrada', async function (this: TruequeVerdeWorld, name: string) {
  const email = `${name.toLowerCase()}@correo.com`;
  const user = await this.container.userService.register(email, 'contraseñaValida123', 'Belgrano');
  this.usersByName.set(name, user);
});

When('{string} elimina la publicación {string}', function (this: TruequeVerdeWorld, name: string, plantName: string) {
  const requester = this.usersByName.get(name)!;
  const publication = this.publicationsByPlant.get(plantName)!;
  this.container.publicationService.delete(publication.id, requester.id);
});

When(
  '{string} intenta eliminar la publicación {string}',
  function (this: TruequeVerdeWorld, name: string, plantName: string) {
    const requester = this.usersByName.get(name)!;
    const publication = this.publicationsByPlant.get(plantName)!;
    try {
      this.container.publicationService.delete(publication.id, requester.id);
    } catch (err) {
      this.lastError = err as Error;
    }
  }
);

Then('la publicación {string} no debe existir más', function (this: TruequeVerdeWorld, plantName: string) {
  const publication = this.publicationsByPlant.get(plantName)!;
  const found = this.container.publicationRepository.findById(publication.id);
  assert.equal(found, undefined);
});

Then('la eliminación debe fallar con el error {string}', function (this: TruequeVerdeWorld, expectedMessage: string) {
  assert.notEqual(this.lastError, undefined);
  assert.equal(this.lastError?.message, expectedMessage);
});

Then('la publicación {string} debe seguir existiendo', function (this: TruequeVerdeWorld, plantName: string) {
  const publication = this.publicationsByPlant.get(plantName)!;
  const found = this.container.publicationRepository.findById(publication.id);
  assert.notEqual(found, undefined);
});
