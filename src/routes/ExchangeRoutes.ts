import { Router } from 'express';
import { ExchangeController } from '../controllers/ExchangeController';

export function createExchangeRoutes(exchangeController: ExchangeController): Router {
  const router = Router();
  
  router.post('/', exchangeController.propose);
  router.post('/:id/accept', exchangeController.accept);
  router.post('/:id/reject', exchangeController.reject);
  
  return router;
}