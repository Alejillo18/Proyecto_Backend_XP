import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { TruequeVerdeWorld } from './world';

Given(
  'el usuario {string} está registrado con barrio {string}',
  async function (this: TruequeVerdeWorld, name: string, barrio: string) {
    const email = `${name.toLowerCase()}@correo.com`;
    const user = await this.container.userService.register(email, 'contraseñaValida123', barrio);
    this.usersByName.set(name, user);
  }
);

When(
  '{string} publica la planta {string} con foto {string} en el barrio {string}',
  function (this: TruequeVerdeWorld, name: string, plantName: string, photo: string, barrio: string) {
    const owner = this.usersByName.get(name)!;
    const publication = this.container.publicationService.publish(plantName, owner.id, barrio, photo);
    this.publicationsByPlant.set(plantName, publication);
  }
);

When(
  '{string} publica la planta {string} sin foto en el barrio {string}',
  function (this: TruequeVerdeWorld, name: string, plantName: string, barrio: string) {
    const owner = this.usersByName.get(name)!;
    const publication = this.container.publicationService.publish(plantName, owner.id, barrio, undefined);
    this.publicationsByPlant.set(plantName, publication);
  }
);

When(
  '{string} intenta publicar una planta sin nombre en el barrio {string}',
  function (this: TruequeVerdeWorld, name: string, barrio: string) {
    const owner = this.usersByName.get(name)!;
    try {
      this.container.publicationService.publish('', owner.id, barrio, undefined);
    } catch (err) {
      this.lastError = err as Error;
    }
  }
);

Then('la publicación de {string} debe estar visible en el listado', function (this: TruequeVerdeWorld, plantName: string) {
  const all = this.container.publicationService.getAll();
  assert.ok(all.some((p) => p.plantName === plantName));
});

Then('el estado de la publicación debe ser {string}', function (this: TruequeVerdeWorld, status: string) {
  const publications = this.container.publicationService.getAll();
  const last = publications[publications.length - 1];
  assert.equal(last.status, status);
});

Then('la publicación de {string} debe mostrar el ícono genérico', function (this: TruequeVerdeWorld, plantName: string) {
  const publication = this.publicationsByPlant.get(plantName)!;
  assert.equal(publication.photo, undefined);
});

Then('la publicación debe fallar con el error {string}', function (this: TruequeVerdeWorld, expectedMessage: string) {
  assert.notEqual(this.lastError, undefined);
  assert.equal(this.lastError?.message, expectedMessage);
});
