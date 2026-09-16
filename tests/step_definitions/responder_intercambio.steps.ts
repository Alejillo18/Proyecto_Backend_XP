import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { TruequeVerdeWorld } from './world';

Given(
  '{string} propuso intercambiar su {string} por el {string} de {string}',
  async function (this: TruequeVerdeWorld, fromName: string, offeredPlant: string, targetPlant: string, toName: string) {
    const fromEmail = `${fromName.toLowerCase()}@correo.com`;
    const toEmail = `${toName.toLowerCase()}@correo.com`;

    const fromUser = await this.container.userService.register(fromEmail, 'contraseñaValida123', 'Belgrano');
    const toUser = await this.container.userService.register(toEmail, 'contraseñaValida123', 'Belgrano');
    this.usersByName.set(fromName, fromUser);
    this.usersByName.set(toName, toUser);

    const offeredPublication = this.container.publicationService.publish(offeredPlant, fromUser.id, 'Belgrano');
    const targetPublication = this.container.publicationService.publish(targetPlant, toUser.id, 'Belgrano');
    this.publicationsByPlant.set(offeredPlant, offeredPublication);
    this.publicationsByPlant.set(targetPlant, targetPublication);

    this.lastOffer = this.container.exchangeService.propose(offeredPublication.id, targetPublication.id, fromUser.id);
  }
);

When('{string} acepta la propuesta', function (this: TruequeVerdeWorld, _name: string) {
  this.lastOffer = this.container.exchangeService.accept(this.lastOffer!.id);
});

When('{string} rechaza la propuesta', function (this: TruequeVerdeWorld, _name: string) {
  this.lastOffer = this.container.exchangeService.reject(this.lastOffer!.id);
});

Then('el estado de la publicación {string} debe ser {string}', function (this: TruequeVerdeWorld, plantName: string, status: string) {
  const publication = this.container.publicationRepository.findById(this.publicationsByPlant.get(plantName)!.id)!;
  assert.equal(publication.status, status);
});

Then('el estado de la propuesta debe ser {string}', function (this: TruequeVerdeWorld, status: string) {
  assert.equal(this.lastOffer?.status, status);
});

Then('{string} debe recibir una notificación del rechazo', function (this: TruequeVerdeWorld, name: string) {
  const user = this.usersByName.get(name)!;
  assert.ok(this.container.notificationService.hasNotification(user.id));
});
