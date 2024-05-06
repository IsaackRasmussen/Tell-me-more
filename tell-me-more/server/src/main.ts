// server/src/main.ts

import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { feedsRouter } from "./routes/feeds.routes"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

app.get('/api', (_req, res) => {
  res.status(200).json({ message: 'Hello from the server!' });
});

app.use('/', feedsRouter)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});