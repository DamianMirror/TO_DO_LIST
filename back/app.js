const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./config/db'); // Подключаем пул соединений
require('dotenv').config();

app.use(cors());
// Настраиваем маршрутизацию
app.use(express.json())

app.use('/api/tasks', require('./routes/Routes'));
// Запускаем сервер
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
