import mongoose from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleVideoLike = asyncHandler(async(req , res)=> {
    const {videoId} = req.params
    const userId = req.user._id

    if (!videoId) {
      throw new ApiError(400, "Video ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid Video ID");
    }

    const existingLike = await Like.findOne({
        video : videoId,
        likedBy: userId
    });

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)

        return res.status(200)
        .json(new ApiResponse(200, "Video unliked"))
    }

    await Like.create({
        video: videoId,
        likedBy: userId
    })

    return res.status(200)
    .json(new ApiResponse(200, "Video liked"))

})
const toggleCommentLike = asyncHandler(async(req , res)=> {
    const {commentId} = req.params
    const userId = req.user._id

    if (!commentId) {
      throw new ApiError(400, "Comment ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({
        comment : commentId,
        likedBy: userId
    });

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)

        return res.status(200)
        .json(new ApiResponse(200, "Comment unliked"))
    }

    await Like.create({
        comment: commentId,
        likedBy: userId
    })

    return res.status(200)
    .json(new ApiResponse(200, "Comment liked"))

})
const toggleTweetLike = asyncHandler(async(req , res)=> {
    const {tweetId} = req.params
    const userId = req.user._id

    if (!tweetId) {
      throw new ApiError(400, "Tweet ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
      throw new ApiError(400, "Invalid Tweet ID");
    }

    const existingLike = await Like.findOne({
        tweet : tweetId,
        likedBy: userId
    });

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)

        return res.status(200)
        .json(new ApiResponse(200, "Tweet unliked"))
    }

    await Like.create({
        Tweet: tweetId,
        likedBy: userId
    })

    return res.status(200)
    .json(new ApiResponse(200, "Tweet liked"))

})
const getLikedVideos = asyncHandler(async(req,res)=> {
    
})


export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike
}