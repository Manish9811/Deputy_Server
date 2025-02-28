import React from 'react'
import { ClearCookie } from '../Services/CookieHandler.js'
const Logout = (req, res) => {

    try {

        const DeleteToken = res.cookie("Token", "")
        // console.log(DeleteToken)
        if (DeleteToken) {
            return res.status(200).json({
                Message: "Logout Success"
            })
        }
        else {
            return res.status(404).json({
                Message: "Logout failed"
            })
        }
    }
    catch (e) {
        console.log(e)
        return res.status(404).json({
            Message: "Logout failed"
        })
    }
}

export default Logout

