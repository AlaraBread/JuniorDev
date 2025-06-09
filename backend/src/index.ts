import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend 2!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 