import { Request, Response } from 'express';
import { PublicationService } from '../services/PublicationService';
import { ValidationError } from '../services/UserService';

export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  publish = async (req: Request, res: Response): Promise<void> => {
    try {
      const { plantName, ownerId, barrio, photo } = req.body; 
      const publication = await this.publicationService.publish(plantName, ownerId, barrio, photo);
      res.status(201).json(publication);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Error interno' });
      }
    }
  };

  search = async (req: Request, res: Response): Promise<void> => {
    const text = (req.query.q as string) || '';
    const barrio = req.query.barrio as string | undefined;
    const results = await this.publicationService.search(text, barrio);

    if (results.length === 0) {
      res.status(200).json({ message: 'No se encontraron plantas', results: [] });
      return;
    }

    res.status(200).json({ results });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const requesterId = req.body.requesterId;
      await this.publicationService.delete(req.params.id, requesterId);
      res.status(204).send();
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Error interno' });
      }
    }
  };
}