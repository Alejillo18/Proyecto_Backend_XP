import { Request, Response } from 'express';
import { ExchangeService } from '../services/ExchangeService';
import { ValidationError } from '../services/UserService';

export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  propose = (req: Request, res: Response): void => {
    try {
      const { offeredPublicationId, targetPublicationId, fromUserId } = req.body;
      const offer = this.exchangeService.propose(offeredPublicationId, targetPublicationId, fromUserId);
      res.status(201).json(offer);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Error interno' });
      }
    }
  };

  accept = (req: Request, res: Response): void => {
    try {
      const offer = this.exchangeService.accept(req.params.id);
      res.status(200).json(offer);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Error interno' });
      }
    }
  };

  reject = (req: Request, res: Response): void => {
    try {
      const offer = this.exchangeService.reject(req.params.id);
      res.status(200).json(offer);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Error interno' });
      }
    }
  };
}
