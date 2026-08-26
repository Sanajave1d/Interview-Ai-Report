const express = require('express');
const jwt = require("jsonwebtoken");
const { blackListTokenModel } = require('../models/blackListToken.model');


async function authUser(req, res, next) {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(401).json({
            message: "refresh token is required "
        })
    }
    const isBlackListed = await blackListTokenModel.findOne({
            token: refreshToken
    })

    if(isBlackListed){
        return res.status(401).json({
            message:"token is invalidated"
        })
    }

    try{
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        if(decoded.type !== "refresh"){
            return res.status(401).json({
                message: "invalid refresh token"
            })
        }

        req.user = decoded
        next()
        

    } catch (error) {
        return res.status(401).json({
            message: "invalid or expired refresh token"
        })
    }
}

module.exports= {authUser}