import mongoose, {isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";


const getAllVideos = asyncHandler(async (req , res) => {
    const {page=1, limit=10, query, sortBy, sortType, userId} = req.query
})

const publishAVideo = asyncHandler(async(req, res) => {
    const {title, description} = req.body
    if (
        [title, description].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }
    const videoLocalPath = req.files?.videoFile[0]?.path;

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if(!videoLocalPath){
        throw new ApiError(400, "Video is required");
    }

    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is required");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile){
        throw new ApiError(401, "Video is required")
    }
    if (!thumbnail){
        throw new ApiError(401, "Thumbnail is required")
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: videoFile.duration,
        owner: req.user?._id
    })

    const publishedVideo = await Video.findById(video._id)

    if (!publishedVideo){
        throw new ApiError(500, "Something went wrong while uploading the video")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, publishedVideo, "Video uploaded successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    if (!videoId?.trim()){
        throw new ApiError(400, "video is missing")
    }
    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $project: {
                videoFile: 1,
                title: 1,
                description: 1,
                views: 1,
                owner: 1,
                createdAt: 1
                
            }
        }
    ])

    if(!video?.length){
        throw new ApiError(404, "video does not exists")
    }

    return res.status(200)
    .json(new ApiResponse(200, video[0], "Video fetched successfully"))

})

const deleteVideo = asyncHandler(async(req, res) => {
    const {videoId} = req.params

    if(!videoId?.trim()){
        throw new ApiError(400, "video is missing")
    }

    await Video.findOneAndDelete({
      _id: videoId,
    });

    return res.status(200)
    .json(new ApiResponse(200, "Video deleted successfully"))
})

const updateVideoDetails = asyncHandler(async(req, res) => {
    const {videoId} = req.params
    const {title, description} = req.body

    if (!videoId?.trim()){
        throw new ApiError(400, "video is missing")
    }

    
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
          $set: {
            title,
            description
          }
        },
        {new: true}
    ).select("-views -owner -duration")

    return res.status(200)
    .json(new ApiResponse(200, video, "Updated successfully"))
})

const updateThumbnail = asyncHandler(async(req, res) => {
    const {videoId} = req.params
    const thumbnailLocalPath = req.file?.path

    if (!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is missing")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!thumbnail.url){
        throw new ApiError(400, "Error while uploading thumbnail")
    }

    const video = await Video.findByIdAndUpdate(
        videoId, 
        {
            $set: {
                thumbnail: thumbnail.url
            }
        },
        {new : true}
    ).select("-duration -owner -views")

    return res.status(200)
    .json(new ApiResponse(200,video, "Thumbnail updated successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    if (!videoId?.trim){
        throw new ApiError(400, "Video is missing")
    }

    const video = await Video.findByIdAndUpdate(
      videoId,
      [
        {
          $set: {
            isPublished: { $not: "$isPublished" },
          },
        },
      ],
      { new: true,
        updatePipeline: true
       }
    ).select({
      isPublished: 1,
    });

    return res.status(200)
    .json(new ApiResponse(200, video, "Status updated"))
})

export {
    publishAVideo,
    getVideoById,
    deleteVideo,
    updateVideoDetails,
    updateThumbnail,
    togglePublishStatus
}