import express from "express";
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';
import cors from "cors";
const app = express();



// const corss = cors();
// const corsOptions ={
//    origin:'*', 
//    credentials:true,            //access-control-allow-credentials:true
//    optionSuccessStatus:200,
// }

// app.use(corss(corsOptions))

const port = 5000;
app.use(
  cors((
    {
      origin: "http://localhost:5000/add/html"
    }
  ))
)
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