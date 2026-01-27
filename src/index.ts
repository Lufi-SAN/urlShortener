import express, { type NextFunction } from 'express';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use((req, res, next) => {//Not Found Handler

})

app.use((err, req, res, next) => {//Error Handler

})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});