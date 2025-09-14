import express from 'express';
import pool from './config/db.js';
import { initSchema } from './config/init.js';
import registerRoutes from './routes';

const app = express();
app.use(express.json());

(async () => {
  try {
    await initSchema(pool);
    console.log(' DB schema ready');
  } catch (err) {
    console.error(' Schema error:', err);
  }
})();

registerRoutes(app);
const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
