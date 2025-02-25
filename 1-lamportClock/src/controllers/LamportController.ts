import { Request, Response } from "express";
import { LamportClockService } from "../services/LamportClockService";

export class LamportController {
  private lamporClockService: LamportClockService;

  constructor(nodePort: number) {
    this.lamporClockService = new LamportClockService(nodePort);
  }

  async sendEvent(req: Request, res: Response): Promise<Response> {
    const { targetPort } = req.params;
    await this.lamporClockService.sendEvent(Number(targetPort));
    return res.status(200).send();
  }

  receiveEvent(req: Request, res: Response): Response {
    const { timestamp } = req.body;
    this.lamporClockService.receiveEvent(timestamp);
    return res.status(200).send();
  }
}
