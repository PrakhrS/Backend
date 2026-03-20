import mongoose from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createPlaylist = asyncHandler(async (req, res)=>{
    const {name, description, videos} = req.body

    if (
        [name, description].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }

    if(!Array.isArray(videos)){
        throw new ApiError(400, "Videos must be an array")
    }
    const invalidVideo = videos.some((id) => !mongoose.Types.ObjectId.isValid(id))

    if(invalidVideo){
        throw new ApiError(400, "Some videos are not valid")
    }
    

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id,
        videos
    })

    return res.status(200)
    .json(new ApiResponse(200,playlist ,"Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async(req, res)=>{
    const {userId} = req.params

    const playlist = await Playlist.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $project:{
                name: 1,
                description: 1,
                videos: 1,
                owner: 1
            }
        }
    ])

    if (!playlist?.length){
        throw new ApiError(404, "No playlist found")
    }

    return res.status(200)
    .json(new ApiResponse(200, playlist[0], "Playlist fetched successfully"))
})

const getPlaylistById = asyncHandler(async(req, res) => {
    const {playlistId} = req.params

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id : new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $project:{
                name: 1,
                description:1,
                videos: 1,
                owner: 1
            }
        }
        
    ])
    if (!playlist?.length) {
      throw new ApiError(400, "Playlist does not exist");
    }

    return res.status(200)
    .json(new ApiResponse(200, playlist[0], "playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async(req,res) => {
    const {playlistId, videoId} = req.params

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet:{
                videos: videoId
            }
        },
        {new : true}
    )

    return res.status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async(req, res) => {
    const {playlistId, videoId} = req.params

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos : videoId
            }
        },
        {new : true}
    )

    return res.status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"))
})

const deletePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params

    if(!playlistId?.trim()){
        throw new ApiError(400, "playlist does not exist")
    }

    await Playlist.findOneAndDelete({
        _id: playlistId
    })

    return res.status(200)
    .json(new ApiResponse(200, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async(req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if(!playlistId?.trim()){
        throw new ApiError(400, "Playlist does not exist")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        {new: true}
    )

    return res.status(200)
    .json(new ApiResponse(200, playlist, "Playlist details updated successfully"))


})


export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}