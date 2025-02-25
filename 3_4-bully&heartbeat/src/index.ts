import express from "express";
import { createRouter } from "./routes/ElectionRoutes";

const app = express();
app.use(express.json());

const args = process.argv.slice(2);
const nodeId: number = parseInt(args[0]);
const ports: number[] = args.slice(1).map(Number);


app.use(createRouter(nodeId, ports));

app.listen(nodeId, () => {
    console.log(`🚀 [Nó ${nodeId}] Servidor rodando na porta ${nodeId}`);
});