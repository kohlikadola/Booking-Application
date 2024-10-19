import express from 'express';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import {check,validationResult} from 'express-validator';
const router=express.Router();
/*
 * 200->Ok
 * 400->Bad Req
 * 500->Terribly Wrong
 * */



/*@Req-> POST 
 @Func-> LOGIN*/
router.post("/register",[
  check("firstname","FirstName Reqd.").isString().notEmpty(),
  check("lastname","LastName Reqd.").isString().notEmpty(),
  check("email","Enter a Valid Addr").isEmail(),
  check("password","Reqd. Min 6 chars").isLength({min:6}),
],async(req,res)=>{
  const err=validationResult(req);
  if(!err.isEmpty()){
    return res.status(400).json({errors :err.array()});
  }
  try{

    //User Exists
    let user=await User.findOne({
      email:req.body.email,
    });
    if(user){
      return res.status(400).json({message:"User Exists!!"});
    }
    //Create a User
    user=new User(req.body);
    await user.save();
    //After Creating do the Token thing
    const token=jwt.sign({userId: user.id},process.env.JWT,{
      expiresIn:"1d"
    });


    res.cookie("auth-token",token,{
      httpOnly:true,
      secure:process.env.NODE_ENV==="production",
      maxAge:24 * 60 * 60 * 1000 
    });
    //we omit the hash psk->{psk->undefined}
    return res.status(200).json({user:{...user.toObject(),password:undefined},message:"User Registered!"}); 

  }catch(e){
    console.log(e);
    res.status(500).send({message:"Something went Wrong"})
  }
});

export default router;
