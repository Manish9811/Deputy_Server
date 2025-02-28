import express  from "express";
import AuthCheck from "../Middleware/AuthCheck.js";
import { Login } from "../Controllers/Login.js";
import Logout from "../Controllers/Logout.js";

const router = express.Router();

router.get("/AuthCheck", AuthCheck);
router.post('/LoginUser', Login);
router.get('/logout', Logout)


export {router as AuthenticationCheck} 