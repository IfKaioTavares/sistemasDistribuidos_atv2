import express from 'express';
import { ElectionService } from '../services/ElectionService';

export class ElectionController {
  private electionService: ElectionService;

  constructor(electionService: ElectionService) {
      this.electionService = electionService;
  }

  async handleElection(req: express.Request, res: express.Response) {
    if (!this.electionService.getNode().isAlive) {
      return res.sendStatus(410);
    }

    await this.electionService.startElection();
    res.sendStatus(200);
  }

  handleCoordinator(req: express.Request, res: express.Response): void {
    const newLeaderId = req.body.coordinator;
    this.electionService.getNode().leaderId = newLeaderId;
    console.log(`👑 [Nó ${this.electionService.getNode().id}] Novo coordenador: Nó ${newLeaderId}`);
    res.sendStatus(200);
  }

  handleHeartbeat(req: express.Request, res: express.Response) {
    if(!this.electionService.getNode().isAlive) {
      return res.sendStatus(410); 
    }
    res.sendStatus(200);
  }
}