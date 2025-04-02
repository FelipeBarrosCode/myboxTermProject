import express from 'express';
import { initializeMongoDB, client } from './collections/schemas.js';
import fileRoutes from './api/fileRoutes.js';

const app = express();
const port = process.env.PORT || 3000;
const uploadPath = process.env.UPLOAD_PATH || 'uploads';


app.use(express.json());
app.use(express.static("public"));
app.use(`/${uploadPath}`, express.static(uploadPath));


initializeMongoDB().catch(console.error);

app.use('/api/files', fileRoutes);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


process.on('SIGINT', async () => {
  await client.close();
  process.exit();
});