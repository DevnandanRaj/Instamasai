const express=require("express");
const UserModel=require("../model/User");
const BlacklistedModel=require("../model/Blacklisted");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const userRouter=express.Router();

userRouter.post("/register",async (req,res)=>{
    const {name,email,gender,password,age,city,is_married}=req.body;
    const userExist= await UserModel.findOne({email});
    if(userExist){
        return res.status(400).send("User already exist, please login")
    }
    else{
        bcrypt.hash(password,5,async function (error,hash){
           const user=new UserModel({
            name,email,gender,password:hash,age,city,is_married
           });
           await user.save();
           res.status(200).send("User registered, please login");
        });
    }
});
userRouter.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user= await UserModel.findOne({email});
        if(!user){
            return res.status(400).send("User does not exist, please register")
        }
        else{
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
        res.status(400).json({msg:"inccorect password"})
        }
        const token=jwt.sign({userId:user._id},"insta",{expiresIn:"7days"});
        res.status(200).json({msg:"user logedin",token})
        }
    } catch (error) {
        res.status(400).json({msg:error})
    }
});


userRouter.post("/logout", async(req,res)=>{
    try {
        const token=req.header("Authorization");
        jwt.verify(token,"insta",async(error,decode)=>{
            if(error){
                return res.status(400).json({msg:"Invalid token"})
            };
            const isBlacklisted=await  BlacklistedModel.findOne({token});
            if(isBlacklisted){
                return res.status(400).json({msg:"token blacklisted, login again"});
            }
            else{
                await BlacklistedModel.create({token});
               return res.status(200).json({msg:"Logedout"})
            }
        })
    } catch (error) {
        res.status(400).json({msg:error})
    }
});



module.exports=userRouter;