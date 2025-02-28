import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { UserAuthenticate } from './Routes/Register.js';
import { UserTimeController } from './Routes/ShiftTimeCalculate.js';
import { AuthenticationCheck } from './Routes/Authentication.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;

app.use(cookieParser());
app.use(express.json());

// Enable CORS


app.use(cors({
  origin: 'https://deputy-clone-frontend-1x5v.vercel.app',
  credentials:true
}))



// Handle CORS preflight requests

// Set up routes
app.get('/', (req, res) => {
  return res.json({ Message: "Server running" });
});

app.use('/api', UserAuthenticate);
app.use('/api', UserTimeController);
app.use('/api/auth', AuthenticationCheck);

// Start server
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
ç