const express=require("express");
require("dotenv").config();
const userRouter=require("./routes/user.route");
const postRouter=require("./routes/post.route")
const connection=require("./connection/db");
const authMiddleware=require("./middleware/authmiddleware")
const app=express();
app.use(express.json());

app.use("/users",userRouter);
app.use(authMiddleware);
app.use("/posts",postRouter)






app.listen(process.env.port,async()=>{
    await connection
    console.log("connected to mongodb")
});