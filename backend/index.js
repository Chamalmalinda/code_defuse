
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();


connectDB();


app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());


app.use('/api/auth',  require('./routes/authRoutes'));
app.use('/api/game',  require('./routes/gameRoutes'));
app.use('/api/users', require('./routes/userRoutes'));


app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));