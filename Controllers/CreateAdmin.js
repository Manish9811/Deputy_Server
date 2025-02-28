import { AdminRegistration } from "../Models/AdminRegistration.js";
import { v4 as uuidv4 } from 'uuid';
import { SaveLoginCookieValue } from "../Services/CookieHandler.js";


export const CreateAdmin = async (req, res, LoginUserName, BusinessEmail, Password) => {

console.log(LoginUserName)
    try {
        const token = uuidv4()

        const SaveAdminData = await AdminRegistration.create({
            LoginUserName: LoginUserName,
            LoginUserToken: token,
            LoginUserRole: "Admin",
            BusinessLocation: "null",
            BusinessIndustry: "null",
            IsLoginUserAdmin: true,
            BusinessName: "null",
            BusinessEmail: BusinessEmail,
            Password: Password,
            createdAt: Date.now(),
            updatedAt: Date.now()

        })

        if (SaveAdminData) {

                SaveLoginCookieValue(token,2 * 60 * 1000000000,'lax',true)
            
         
            return res.status(200).json({
                Message: "Profile Created Successfully"
            })
        }

        else {

            return res.status(404).json({
                Message: "Error Save Data"
            })
        }

    }
    catch (e) {
        console.log(e)
        return res.status(404).json({
            Message: "Error Save Data !! Internal server error"
        })
    }
}

export default CreateAdmin