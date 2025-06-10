import { Router, Request, Response } from 'express';
import { authStore } from '../db/auth';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth, (req: Request, res: Response) => {
  const users = authStore.getAllUsers();
  res.json({ users });
});

export default router; 