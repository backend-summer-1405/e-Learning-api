import type {Request, Response} from "express";
import { createUserService } from "./user.service.js";

export const createUserController = async (
    req : Request,
    res :  Response,
    
) => {
    const user = await createUserService(req.body);
    res.status(201).json({
        success : true,
        data : user,
        message : "create user is successfully",
    })
}