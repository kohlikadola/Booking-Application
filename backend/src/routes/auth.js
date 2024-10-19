import express from 'express';
import {check,validationResult} from 'express-validator';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import verifyToken from '../middleware/auth.js';



const router=express.Router();

/*
@req->Post
@desc->login
 */
router.post("/login",[
  check("email","Enter Addr.").isString().notEmpty(),
  check("password","Enter PSK").isString().notEmpty(),
],
  async(req,res)=>{
    const err=validationResult(req);
    if(!err.isEmpty()){
      return res.status(400).json({errors:err.array()});
    }
    const {email,password}=req.body;
    try{
      const user=await User.findOne({email});
      if(!user){
        return res.status(400).json({message:"Invalid Credentials"});
      }
      const isMatch=await bcrypt.compare(password,user.password);
      if(!isMatch){
        return res.status(500).json({message:"Invalid Credentials"});
      }
      //Valid PSK
      //sign a token and return a cookie
      const token=jwt.sign({userId:user.id},process.env.JWT,{
        expiresIn:"1d"
      });
      res.cookie("auth-token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        maxAge:86400000
      })
      return res.status(200).json({userId:user._id,message:"Login Success"});
    }
    catch(err){
      console.log(err);
      return res.status(500).json({message:"Something Went Wrong"});
    }
  }
);

/*@req->GET
 *@DESC->validate token
 * */
router.get("/validate-token",verifyToken,(req,res)=>{
  res.status(200).send({userId:req.userId});
});
/*@req->POST
 * @Desc->LogOut*/
router.post("/logout", (req, res) => {
  res.cookie("auth-token", "", {
    expires: new Date(0),
  });
  res.send();
});
export default router;
