import express from 'express';
import toolsRouter from './toolsRouter.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/tools', toolsRouter);

app.use((req, res) => {
  res.send(404);
})
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});