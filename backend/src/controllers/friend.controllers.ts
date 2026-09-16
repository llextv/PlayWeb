import { Request, Response } from "express";
import friendServices from "../services/friend.services.js";
import {z} from "zod";

const parseId = z.string().min(5).max(255);

const getFriends = async(req: Request, res: Response) => {
  try {
    let userId = req.user.id;
    
    let friendService = await friendServices.getFriends(userId);
    if(!friendService.success) return res.status(500).json({success: false, error: "Friend Service failed"});

    return res.status(200).json({
      success: true,
      userId,
      friends: friendService.friends,
    })
  }catch(error){
    console.error(error);
    return res.status(500).json({success: false, error: "Internal Server Error"});
  }
};

const askFriends = async(req: Request, res: Response) => {
  try{
    let userId = req.user.id;
    let friend = parseId.parse(req.params.friendUserId);

    let result = await friendServices.askFriends(userId, friend);
    if(!result.success) return new Error("Ask Friend failed");

    return res.status(200).json({success: true, result});
  }catch(error){
    console.error(error);
    return res.status(500).json({sucess: false, error: "Internal Server Error"});
  }
}

const acceptFriends = async(req: Request, res: Response) => {
  try{
    let userId = req.user.id;
    let friend = parseId.parse(req.params.friendId);

    let result = await friendServices.acceptFriends(userId, friend);
    if(!result.success) return new Error("Accept Friend failed");

    return res.status(200).json({success: true, result});
  }catch(error){
    console.error(error);
    return res.status(500).json({sucess: false, error: "Internal Server Error"});
  }
}

const declineFriends = async(req: Request, res: Response) => {
  try{
    let userId = req.user.id;
    let friend = parseId.parse(req.params.friendId);

    let result = await friendServices.declineFriends(userId, friend);
    if(!result.success) return new Error("Decline Friend failed");

    return res.status(200).json({success: true, result});
  }catch(error){
    console.error(error);
    return res.status(500).json({sucess: false, error: "Internal Server Error"});
  }
}

const deleteFriend = async(req: Request, res: Response) => {
  try{
    let userId = req.user.id;
    let friend = parseId.parse(req.params.friendId);

    let result = await friendServices.deleteFriend(userId, friend);
    if(!result.success) return new Error("Delete Friend failed");

    return res.status(200).json({success: true});
  }catch(error){
    console.error(error);
    return res.status(500).json({sucess: false, error: "Internal Server Error"});
  }
};

export default {getFriends, askFriends, acceptFriends, declineFriends, deleteFriend}