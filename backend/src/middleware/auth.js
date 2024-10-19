import jwt from 'jsonwebtoken';

const verifyToken=(req,res,next)=>{
  //auth-token from cookie
  const token=req.cookies["auth-token"];
  if(!token){
    return res.status(401).json({message:"Unauthorized Access"});
  }
  try{
    const decoded=jwt.verify(token,process.env.JWT);
    req.userId=decoded.userId;
    
  next();
  }catch(e){
    console.log(e);
    return res.status(401).json({message:"Unauthorized Access"});
  }
};
export default verifyToken;
