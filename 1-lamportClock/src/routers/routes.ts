import { Router, Request, Response } from "express";
import { LamportController } from "../controllers/LamportController";

export const createRouter = (nodePort: number) : Router => {
  const router = Router();
  const lamportController = new LamportController(nodePort);

  router.post("/message/:targetPort", (req: Request, res: Response) => {lamportController.sendEvent(req, res)});
  router.post("/message", (req: Request, res: Response) => {lamportController.receiveEvent(req, res)});

  return router;
}