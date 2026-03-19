import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js";

const getVideoComments = asyncHandler(async(req , res) =>{
    const {videoId} = req.params
    const {page=1, limit=10}=req.query
})

const addComment = asyncHandler(async(req, res) => {
    const {content} = req.body;
    const {videoId} = req.params

    if (!content?.trim()){
        throw new ApiError(400, "Empty Comment")
    }
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    });

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment created successfully"))

})

const updateComment = asyncHandler(async(req, res) =>{
    const {content} = req.body;
    const {commentId} = req.params

    if (!content?.trim()){
        throw new ApiError(400, "Empty Comment")
    }
    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        {new : true}
    )

    return res.status(200)
    .json(new ApiResponse(200,comment,"Comment updated successfully"))

})

const deleteComment = asyncHandler(async(req, res) => {
    const {commentId} = req.params

    if(!commentId?.trim()){
            throw new ApiError(400, "comment is not found")
        }
    
        await Comment.findOneAndDelete({
          _id: commentId,
        });
    
        return res.status(200)
        .json(new ApiResponse(200, "Comment deleted successfully"))
})


export {
    addComment,
    updateComment,
    deleteComment

}