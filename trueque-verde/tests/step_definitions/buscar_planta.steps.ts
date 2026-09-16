import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { TruequeVerdeWorld } from './world';

Given(
  'existen publicaciones de {string}, {string} y {string}',
  async function (this: TruequeVerdeWorld, plant1: string, plant2: string, plant3: string) {
    const owner = await this.container.userService.register('dueno@correo.com', 'contraseñaValida123', 'Belgrano');
    [plant1, plant2, plant3].forEach((plantName) => {
      this.container.publicationService.publish(plantName, owner.id, 'Belgrano');
    });
  }
);

When('busco plantas con el texto {string}', function (this: TruequeVerdeWorld, text: string) {
  this.searchResults = this.container.publicationService.search(text);
  this.searchMessage = this.searchResults.length === 0 ? 'No se encontraron plantas' : undefined;
});

Then('el resultado debe incluir la publicación {string}', function (this: TruequeVerdeWorld, plantName: string) {
  assert.ok(this.searchResults.some((p) => p.plantName === plantName));
});

Then('el resultado no debe incluir la publicación {string}', function (this: TruequeVerdeWorld, plantName: string) {
  assert.ok(!this.searchResults.some((p) => p.plantName === plantName));
});

Then('debo ver el mensaje {string}', function (this: TruequeVerdeWorld, expectedMessage: string) {
  assert.equal(this.searchMessage, expectedMessage);
});
