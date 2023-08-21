const express=require("express");
const postRouter=express.Router();
const PostModel=require("../model/Post");

postRouter.post("/add",async (req,res)=>{
    try {
        const {title,body,device,no_of_comments}=req.body;
        const userId=req.user;
        const post=new PostModel({title,body,device,no_of_comments,userId});
        await post.save();
        return res.status(200).json({msg:"Post created"})
    } catch (error) {
        res.status(400).json({msg:"Something went wrong"});
    }
});
postRouter.get("/top", async (req, res) => {
    try {
        const userId=req.user;
        const {page=1}=req.query;
        const limit=3;
        const topPosts = await PostModel.find({ userId })
            .sort({ no_of_comments:"desc"})
            .skip((page-1)*limit)
            .limit(limit);

       return res.status(200).json(topPosts);
    } catch (error) {
        res.status(400).json({ msg:"Something went wrong" });
    }
});
postRouter.patch("/update/:id",async (req,res)=>{
    try {
        const {title,body,device,no_of_comments}=req.body;
        const postId=req.params.id;
        const userId=req.user;
        const post = await PostModel.findOne({_id:postId,userId});
        if(!post){
            return res.status(400).json({msg:"Post not found"})
        }
        post.title=title;
        post.body=body;
        post.device=device;
        post.no_of_comments=no_of_comments;
        await post.save();
        res.status(200).json({msg:"Post updated"})
    } catch (error) {
        return res.status(400).json({msg:"Something went wrong"})
    }
});


postRouter.delete("/delete/:id",async (req,res)=>{
    try {
        const postId=req.params.id;
        const post = await PostModel.findOneAndRemove({_id:postId});
        if(!post){
            return res.status(400).json({msg:"Post not found"})
        }
        else{
        res.status(200).json({msg:"Post deleted"});
        }
    } catch (error) {
        return res.status(400).json({msg:"Something went wrong"})
    }
});

module.exports=postRouter;