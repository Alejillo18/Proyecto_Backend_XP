import { Request, Response } from 'express';
import { UserService, ValidationError, ConflictError } from '../services/UserService';

export class UserController {
  constructor(private readonly userService: UserService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, barrio } = req.body;
      const user = await this.userService.register(email, password, barrio);
      res.status(201).json({ id: user.id, email: user.email, barrio: user.barrio });
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
      } else if (err instanceof ConflictError) {
        res.status(409).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Error interno' });
      }
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await this.userService.login(email, password);
      res.status(200).json({ id: user.id, email: user.email });
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(401).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Error interno' });
      }
    }
  };
}
