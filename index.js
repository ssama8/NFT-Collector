import express from "express";
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const app = express();
mongoose.connect(process.env.CONNECTION_URI);
const db = mongoose.connection
db.once("open", () => console.log("Connected to the databse"));
const port = 4000;

app.use(bodyParser.json());
app.use(express.static('public'))
app.use('/users', usersRoutes);
app.get('/', (req, res)=>{
  console.log('Visited')
  res.send("hello from homepage")
})

app.listen(port ,()=>{
  console.log(`Server running on port: http://localhost:${port}`)
});
