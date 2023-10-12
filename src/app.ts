import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth-routes";
import credentialRouter from "./routes/credential-routes";

dotenv.config()
const app = express();
app
  .use(express.json())
  .use(authRouter)
  .use(credentialRouter)

const port = +process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
})

export default app;