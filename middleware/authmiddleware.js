const jwt =require("jsonwebtoken");
const BlacklistedModel=require("../model/Blacklisted");

const authMiddleware=async (req,res,next)=>{
    try {
        const token=req.header("Authorization");
        if(!token){
            return res.status(400).json({msg:"token not found, please login"});
        }
        else{
        const isBlacklisted=await  BlacklistedModel.findOne({token});
        if(isBlacklisted){
            return res.status(400).json({msg:"token blacklisted, login again"});
        }
        const decode =jwt.verify(token,"insta");
        req.user=decode.userId;
        next();
    }
       
    } catch (error) {
        return res.status(400).json({msg:error});
    }
};


module.exports=authMiddleware;