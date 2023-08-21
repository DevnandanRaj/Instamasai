const mongoose=require("mongoose");

const BlacklistedSchema=new mongoose.Schema({
    token:String,
});
const BlacklistedModel=mongoose.model("Blacklisted",BlacklistedSchema);
module.exports=BlacklistedModel;