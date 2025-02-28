import validator from "email-validator";
import { SendMail } from "../Services/OtpServices.js";
import otpGenerator from 'otp-generator'
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import cookieParser from "cookie-parser";
import { OtpData } from "../Models/RegisterationOtp.js";
import bcrypt from 'bcrypt'
import { AdminRegistration } from "../Models/AdminRegistration.js";

// Generate a random UUID
const randomToken = uuidv4();

const UserRegistery = async (req, res) => {

    const { LoginUserName, BusinessName, BusinessEmail, BusinessType, JobTypes, BusinessLocation, Password, ConfirmPassword } = req.body;

    //    User registeration validation


    const tokenAuth = req.headers.authorization;
    if (!tokenAuth || tokenAuth != process.env.Secret_key) return res.status(404).json({ messsage: "Unauthorized token" })
    try {

        if (LoginUserName) {

            if (BusinessEmail) {

                // Validate email

                const validateEmail = validator.validate(BusinessEmail)

                if (validateEmail) {

                    if (Password && ConfirmPassword) {

                        if (Password.length > 7) {

                            if (Password === ConfirmPassword) {


                                // Checl whether the email already register or not

                                const GetEmail = await AdminRegistration.findAll({
                                    attributes: ['BusinessEmail'],
                                    raw: true
                                });

                                const AllRegisterEmails = GetEmail.map(value => jwt.verify(value.BusinessEmail, process.env.Secret_key).BusinessEmail);
                                if(AllRegisterEmails.includes(BusinessEmail)) return res.status(400).json({Message : "Email Already Registered"})

                                try {
                                    const Otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
                                    const CookieToken = uuidv4();


                                    // Save token in cookie;

                                    res.cookie('session', CookieToken, {
                                        httpOnly: false,  // Prevents client-side access
                                        secure: process.env.NODE_ENV === 'production',    // Only sent over HTTPS
                                        sameSite: 'lax', // Protects against CSRF
                                        maxAge: 2 * 60 * 1000000000 ,  
                                        path: '/'
                                    });


                                    const SignEmail = jwt.sign( {BusinessEmail} , process.env.Secret_key);

                                    const SignOtp = jwt.sign({ Otp }, process.env.Secret_key);

                                    const HashPassword = await bcrypt.hash(Password,10);


                                    res.cookie("data", JSON.stringify({LoginUserName : LoginUserName,BusinessEmail: SignEmail,Password:HashPassword}))


                                    try {

                                        SendMail(BusinessEmail,"Test","tEXT", Otp)

                                        const SaveOtp = await OtpData.create({
                                            Otp_Requested_By: CookieToken,
                                            Otp_Requested_Email: SignEmail,
                                            Otp: SignOtp,
                                            createdAt : Date.now(),
                                            updatedAt : Date.now()
                                
                                        })

                                        return res.status(200).json({
                                            message : "Otp sent successfully"
                                        })

                                    }
                                    catch (e) {
                                        console.log(e)
                                        return res.status(404).json({
                                            message: 'Internal server error'
                                        })
                                    }



                                }

                                catch (e) {
                                    console.log(e)
                                    return res.status(404).json({
                                        Message: "OTP send Failed"
                                    })
                                }


                            }
                            else return res.status(404).json({ Message: "Password must match with confirm password" })

                        }
                        else return res.status(404).json({ Message: "Password must contain 8 chars" })

                    }
                    else return res.status(400).json({ Message: "Password Required" })

                }


                else return res.status(404).json({ Message: "Valid Email Required" })

            }
            else return res.status(400).json({ Message: "Business Eamil Required" })
        }
        else return res.status(400).json({ Message: "Admin Name Required" })
    }
    catch (e) {
        console.log(e)
        return res.status(404).json({
            Message: e.message
        })
    }
}


export default UserRegistery