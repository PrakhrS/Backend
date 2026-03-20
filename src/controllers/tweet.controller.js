import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createTweet = asyncHandler(async(req,res) => {
    const {content} = req.body

    if (!content?.trim()){
        throw new ApiError(400, "content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    })

    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet created successfully"));


})

const getUserTweets = asyncHandler(async(req, res)=>{
    const {userId} = req.params

    if(!userId?.trim()){
        throw new ApiError(400, "No tweets")
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid userId");
    }

    const tweet = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
    ])

    if(!tweet?.length){
        throw new ApiError(404,"Tweets does not exist")
    }

    return res.status(200)
    .json(new ApiResponse(200, tweet, "Tweet fetched successfully"))

})

const updateTweet = asyncHandler(async(req, res) => {
    const {content} = req.body
    const {tweetId} = req.params

    if(!tweetId?.trim()){
        throw new ApiError(400, "Tweet does not exists")
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        {new: true}
    )

    return res.status(200)
    .json(new ApiResponse(200,tweet,"Tweet updated"))
})

const deleteTweet = asyncHandler(async(req,res) => {
    const {tweetId} = req.params

    if(!tweetId?.trim()){
        throw new ApiError(400, "tweet is missing")
    }
    
    await Tweet.findByIdAndDelete({
        _id: tweetId
    })

    return res.status(200)
    .json(new ApiResponse(200, "Tweet is updated successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}