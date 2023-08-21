
const mongoose=require("mongoose");
const postSchema=new mongoose.Schema({
    title:{type:String},
    body:{type:String},
    device:{type:String},
    no_of_comments:{type:Number},
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true,
    }
});
const PostModel=mongoose.model("Post",postSchema);

module.exports=PostModel;