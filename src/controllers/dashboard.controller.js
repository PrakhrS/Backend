import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";


const getChannelStats = asyncHandler(async (req, res) =>{
    const {channelId} = req.params
    
    const stats = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $facet:{
            videosData: [
                {
                    $lookup:{
                        from: "videos",
                        localField: "_id",
                        foreignField: "owner",
                        as: "videos"
                    }
                },
                {
                    $project:{
                        totalVideos: {$size: "$videos"},
                        totalViews: { $sum: "$videos.views"},
                        videoIds: "$videos._id"
                    }
                }
            ],

            likesData: [
                {
                    $lookup: {
                        from: "videos",
                        localField: "_id",
                        foreignField: "owner",
                        as: "videos"
                    }
                },
                {
                    $unwind: "$videos" //breaks the array of videos into separate objects
                },
                {
                    $lookup: {
                        from: "likes",
                        localField: "videos._id",
                        foreignField: "video",
                        as: "likes"
                    }
                },
                {
                    $group:{
                        _id: null,
                        totalLikes: { $sum: {$size: "$likes"}}
                    }
                }

            ],

            subscribersData: [
                {
                    $lookup: {
                        from: "subscriptions",
                        localField: "_id",
                        foreignField: "channel",
                        as: "subs"
                    }
                },
                {
                    $project:{
                        totalSubscribers: {$size: "$subs"}
                    }
                }
            ]
        }
      }
    ]);

    const result = {
      totalVideos: stats[0]?.videosData[0]?.totalVideos,
      totalViews: stats[0]?.videosData[0]?.totalViews,
      totalLikes: stats[0]?.likesData[0]?.totalLikes,
      totalSubscribers: stats[0]?.subscribersData[0]?.totalSubscribers
    };

    return res.status(200)
    .json(new ApiResponse(200, result, "Channel stats fetched successfully"))

})

const getChannelVideos = asyncHandler(async(req,res) =>{
    const {channelId} = req.params

    const list = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $project:{
                title: 1,
                description: 1,
                views: 1

            }
        }
    ])

    if(!list?.length){
        throw new ApiError(400, "No video uploaded")
    }

    return res.status(200)
    .json(new ApiResponse(200, list, "Videos fetched successfully"))
})

export {
    getChannelStats,
    getChannelVideos
}