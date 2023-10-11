import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth-routes";

dotenv.config()
const app = express();
app
  .use(express.json())
  .use(authRouter)

const port = +process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
})

export default app;