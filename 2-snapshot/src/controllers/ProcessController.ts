import { Request, Response } from 'express';
import { ProcessService } from '../services/ProcessService';

export class ProcessController {
  constructor(private processService: ProcessService) {}

  connect = (req: Request, res: Response) => {
    const { neighbor } = req.body;
    this.processService.connect(neighbor);
    res.send({ message: `Connected to ${neighbor}` });
  };

  sendMessage = (req: Request, res: Response) => {
    const { to, message } = req.body;
    this.processService.sendMessage(to, message);
    res.send({ message: `Message sent to ${to}` });
  };

  receiveMessage = (req: Request, res: Response) => {
    const { from, message } = req.body;
    this.processService.receiveMessage(from, message);
    res.send({ message: 'Message received' });
  };

  initiateSnapshot = (req: Request, res: Response) => {
    const neighbors = this.processService.initiateSnapshot();
    res.send({ message: 'Snapshot initiated', neighbors });
  };

  receiveMarker = (req: Request, res: Response) => {
    const { from } = req.body;
    this.processService.receiveMarker(from);
    res.send({ message: 'Marker received' });
  };

  getState = (req: Request, res: Response) => {
    res.json(this.processService.getState());
  };

  checkSnapshotCompletion = (req: Request, res: Response) => {
    this.processService.checkSnapshotCompletion();
    res.send({ message: 'Snapshot completion checked' });
  };
}