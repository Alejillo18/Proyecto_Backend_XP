import { Request, Response } from 'express';
import { ExchangeService } from '../services/ExchangeService';
import { ValidationError } from '../services/UserService';

export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  propose = async (req: Request, res: Response): Promise<void> => {
    try {
      const { offeredPublicationId, targetPublicationId, fromUserId } = req.body;
      const offer = await this.exchangeService.propose(offeredPublicationId, targetPublicationId, fromUserId);
      res.status(201).json(offer);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Error interno' });
      }
    }
  };

  accept = async (req: Request, res: Response): Promise<void> => {
    try {
      const offer = await this.exchangeService.accept(req.params.id);
      res.status(200).json(offer);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Error interno' });
      }
    }
  };

  reject = async (req: Request, res: Response): Promise<void> => {
    try {
      const offer = await this.exchangeService.reject(req.params.id);
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