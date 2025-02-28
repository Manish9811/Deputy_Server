import validator from "email-validator";
import { AdminRegistration } from "../Models/AdminRegistration.js";
import jwt from 'jsonwebtoken'
import { Op } from "sequelize";
import { use } from "react";
import bcrypt from 'bcrypt'
import { SaveLoginCookieValue } from "../Services/CookieHandler.js";

export const Login = async (req, res) => {


    try {

        const { Email, Password } = req.body;


        console.log(Email, Password)


        if (Email && Password) {

            // Validate the email

            const IsEmailValidate = validator.validate(Email) ? true : false;

            if (IsEmailValidate) {


                // Check user input his password or not

                const IfUserInputPassword = Password ? true : false

                if (IfUserInputPassword) {

                    // Check the email in the database

                    const Users = await AdminRegistration.findAll({
                        attributes: ["BusinessEmail", 'Password'], // Select only the 'businessemail' column
                        raw: true,
                    });


                    const EmailArray = Users.map(user => jwt.verify(user.BusinessEmail, process.env.Secret_key).BusinessEmail);


                    const IsEmailRegister = EmailArray.includes(Email);

                    if (IsEmailRegister) {

                        const EmailIndex = EmailArray.indexOf(Email);

                        // Check Password


                        const UserPassword = Users[EmailIndex].Password;

                        const IsPasswordMatch = await bcrypt.compare(Password, UserPassword);

                        if (IsPasswordMatch) {
                            const GetLoginUserToken = await AdminRegistration.findAll({
                                where: {
                                    [Op.and]: {
                                        BusinessEmail: Users[EmailIndex].BusinessEmail,
                                        Password: UserPassword
                                    }
                                },
                                attributes: ['LoginUserToken'],
                                raw: true
                            })

                            const LoginUserToken = GetLoginUserToken[0].LoginUserToken;

                            if (LoginUserToken) {

                                SaveLoginCookieValue(req,res,LoginUserToken, 2 * 60 * 1000000000, 'lax', true)

                                return res.status(200).json({
                                    Message: "Profile Login Successfully"
                                })
                            }
                            else {

                                return res.status(400).json({
                                    Message: "Cannot login please try again"
                                })
                            }
                        }

                        else {
                            return res.status(400).json({
                                Message: "Cannot find account with this credrentials"
                            })
                        }
                    }

                    else {
                        return res.status(404).json({
                            Message: "Email Not Register"
                        })
                    }


                }

                else {
                    return res.status(404).json({
                        Message: "Password Required"
                    })
                }

                // Search the email and password in database



            }

            else {
                return res.status(404).json({
                    Message: "Email is not validate"
                })
            }



            // Search the email and password in database
        }

        else {
            return res.status(404).json({
                Message: "Email and Password Required"
            })
        }

    }

    catch (e) {
        console.log(e)
        return res.json({
            Messsage: "Internal server error"
        })
    }

}

