import { AdminRegistration } from "../Models/AdminRegistration.js";

const AuthCheck = async (req,res) => {
    

    const UserLoginToken = req.cookies.Token;

    console.log(UserLoginToken)

    try{
    const SearchUser = await AdminRegistration.findAll({where:{LoginUserToken : UserLoginToken}});

    const IsFindUserAdmin = SearchUser[0].IsLoginUserAdmin == 1 && SearchUser[0].LoginUserRole == "Admin"?true:false
    

    if(SearchUser && SearchUser[0].LoginUserName) {
        return res.status(200).json({
            Message : "User Found",
            IsUserAdmin : IsFindUserAdmin
        })
    }

}
catch(e){
    return res.status(404).json({
        Message : "No User Found"
    })
}

}

export default AuthCheck