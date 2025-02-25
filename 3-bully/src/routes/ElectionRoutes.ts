import express from "express";
import { Node } from "../Node";
import { ElectionService } from "../services/ElectionService";
import { ElectionController } from "../controllers/ElectionController";

export const createRouter = (nodeId: number, ports: number[]): express.Router => {
  const router = express.Router();
  const node = new Node(nodeId);
  const electionService = new ElectionService(node, ports);
  const electionController = new ElectionController(electionService);

  router.post("/election", (req, res) => {electionController.handleElection(req, res)});
  router.post("/coordinator", (req, res) => electionController.handleCoordinator(req, res));
  router.get("/heartbeat", (req, res) => {electionController.handleHeartbeat(req, res)});

  return router;
};