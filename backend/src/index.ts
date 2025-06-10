import express, { Request, Response } from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import { requireAuth } from './middlewares/auth';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/auth', authRouter);

// Users routes
app.use('/users', usersRouter);
// Protected route example
app.get('/protected', requireAuth, (req: Request, res: Response) => {
  res.json({ 
    user: req.user 
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 