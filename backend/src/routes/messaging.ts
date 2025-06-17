import { Request, Response, Router } from "express";
import { messageStore } from "../db/message";
import { UUID } from "crypto";
import { requireAuth } from "../middlewares/auth";

const router = Router();
router.get("/", requireAuth, (req: Request, res: Response) => {
	const { withUser } = req.query;
	res.json(messageStore.findMessages(req.user?.id as UUID, withUser as UUID));
});

router.post("/send", requireAuth, (req: Request, res: Response) => {
	const { toUser, content } = req.body;
	messageStore.createMessage(content, req.user?.id as UUID, toUser);
	res.json({});
});

export default router;
