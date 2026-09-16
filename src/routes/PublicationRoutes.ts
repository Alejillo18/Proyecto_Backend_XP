import { Router } from 'express';
import { PublicationController } from '../controllers/PublicationController';

export function createPublicationRoutes(publicationController: PublicationController): Router {
  const router = Router();
  
  router.post('/', publicationController.publish);
  router.get('/search', publicationController.search);
  router.delete('/:id', publicationController.delete);
  
  return router;
}