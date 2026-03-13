
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();


connectDB();


app.use(cors({
    origin:      'http://localhost:5173',
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth',  require('./routes/authRoutes'));
app.use('/api/game',  require('./routes/gameRoutes'));
app.use('/api/users', require('./routes/userRoutes'));



app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));