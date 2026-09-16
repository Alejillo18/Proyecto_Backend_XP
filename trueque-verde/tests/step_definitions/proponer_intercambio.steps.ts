import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { TruequeVerdeWorld } from './world';

Given('{string} publicó la planta {string}', async function (this: TruequeVerdeWorld, name: string, plantName: string) {
  const email = `${name.toLowerCase()}@correo.com`;
  let owner = this.usersByName.get(name);
  if (!owner) {
    owner = await this.container.userService.register(email, 'contraseñaValida123', 'Belgrano');
    this.usersByName.set(name, owner);
  }
  const publication = this.container.publicationService.publish(plantName, owner.id, 'Belgrano');
  this.publicationsByPlant.set(plantName, publication);
});

When(
  '{string} propone intercambiar su {string} por el {string} de {string}',
  function (this: TruequeVerdeWorld, fromName: string, offeredPlant: string, targetPlant: string, _toName: string) {
    const fromUser = this.usersByName.get(fromName)!;
    const offeredPublication = this.publicationsByPlant.get(offeredPlant)!;
    const targetPublication = this.publicationsByPlant.get(targetPlant)!;

    try {
      this.lastOffer = this.container.exchangeService.propose(
        offeredPublication.id,
        targetPublication.id,
        fromUser.id
      );
    } catch (err) {
      this.lastError = err as Error;
    }
  }
);

When(
  '{string} intenta proponer un intercambio sobre su propio {string}',
  function (this: TruequeVerdeWorld, name: string, plantName: string) {
    const user = this.usersByName.get(name)!;
    const publication = this.publicationsByPlant.get(plantName)!;
    try {
      this.lastOffer = this.container.exchangeService.propose(publication.id, publication.id, user.id);
    } catch (err) {
      this.lastError = err as Error;
    }
  }
);

Then('la propuesta debe crearse con estado {string}', function (this: TruequeVerdeWorld, status: string) {
  assert.notEqual(this.lastOffer, undefined);
  assert.equal(this.lastOffer?.status, status);
});

Then('{string} debe recibir una notificación de la propuesta', function (this: TruequeVerdeWorld, name: string) {
  const user = this.usersByName.get(name)!;
  assert.ok(this.container.notificationService.hasNotification(user.id));
});

Then('la propuesta debe fallar con el error {string}', function (this: TruequeVerdeWorld, expectedMessage: string) {
  assert.notEqual(this.lastError, undefined);
  assert.equal(this.lastError?.message, expectedMessage);
});
