import express from 'express';
import { processRouter } from './routes/ProcessRoutes';

const app = express();
app.use(express.json());

const port = process.argv[2] || 3000;
app.use('/process', processRouter);

app.listen(port, () => {
  console.log(`Process running on port ${port}`);
});