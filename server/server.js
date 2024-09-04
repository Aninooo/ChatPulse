const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const uploadRoutes = require('./routes/upload');
const setupSocketIO = require('./socket');
require('dotenv').config();

const app = express();
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/upload', uploadRoutes);

const server = http.createServer(app);
setupSocketIO(server);

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI).then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
