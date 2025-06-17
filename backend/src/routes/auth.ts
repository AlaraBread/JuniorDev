import { Request, Response, Router } from "express";
import { authStore } from "../db/auth";

const router = Router();

router.post("/register", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required",
    });
  }

  try {
    const user = authStore.createUser(username, password);
    res.status(201).json({
      id: user.id,
      username: user.username,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required",
    });
  }

  try {
    const token = authStore.login(username, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token) {
    authStore.logout(token);
  }

  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
