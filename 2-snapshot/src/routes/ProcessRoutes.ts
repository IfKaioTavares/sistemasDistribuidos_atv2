import express from 'express';
import { ProcessService } from '../services/ProcessService';
import { ProcessController } from '../controllers/ProcessController';

const router = express.Router();
const processService = new ProcessService(Number(process.argv[2] || 3000));
const processController = new ProcessController(processService);

router.post('/connect', processController.connect);
router.post('/send', processController.sendMessage);
router.post('/receive', processController.receiveMessage);
router.post('/snapshot', processController.initiateSnapshot);
router.post('/marker', processController.receiveMarker);
router.get('/state', processController.getState);
router.post('/snapshot/complete', processController.checkSnapshotCompletion);

export { router as processRouter };
