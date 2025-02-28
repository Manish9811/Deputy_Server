import React from 'react'

export const SaveLoginCookieValue = (req,res,token,time,site,httpOnly) => {
    res.cookie("Token", token, {
        httpOnly: httpOnly,  // Prevents client-side access
        secure: process.env.NODE_ENV === 'production',    // Only sent over HTTPS
        sameSite: site, // Protects against CSRF
        maxAge: time,
        path: '/'
    })
}


export const ClearCookie = (req,res) => {
    res.cookie("Token", "", {
        maxAge: 0,
        httpOnly: true,  // Prevents client-side access
        secure: process.env.NODE_ENV === 'production',    // Only sent over HTTPS
        sameSite: 'Strict', // Protects against CSRF
        path: '/'
    })
}

