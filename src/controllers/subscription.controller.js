import mongoose from "mongoose";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleSubscription = asyncHandler(async(req,res) => {
    const {channelId} = req.params

    const subscribeCheck = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user?._id
    })

    if(subscribeCheck){
        await Subscription.findByIdAndDelete(
            subscribeCheck._id
        )

        return res.status(200)
        .json(new ApiResponse(200, "Channel unsubscribed"))
    }

    const subscribed = await Subscription.create({
        subscriber: req.user?._id,
        channel: channelId
    })

    if(!subscribed){
        throw new ApiError(500, "Something went wrong plese try again")
    }

    return res.status(200)
    .json(new ApiResponse(200,subscribed, "Channel subscribed"))
})

const getUserChannelSubscribers = asyncHandler(async(req,res) => {
    const {channelId} = req.params

    const list = await Subscription.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $project: {
            subscriber: 1
        }
      }
    ]);

    if(!list?.length){
        throw new ApiError(400, "No subscribers")
    }

    return res.status(200)
    .json(new ApiResponse(200, list, "Subscriber list fetched successfully"))
})

const getSubscribedChannels = asyncHandler(async(req,res)=>{
    const subscriberId = req.user._id

    const list = await Subscription.aggregate([
        {
            $match: {
                subscriber : new mongoose.Types.ObjectId(subscriberId)
        
            }
        },
        {
            $project: {
                channel: 1
            }
        }
    ])
    

    if(!list?.length){
        throw new ApiError(400, "No channels found")
    }

    return res.status(200)
    .json(new ApiResponse(200, list, "Channels fetched successfully"))
})


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}