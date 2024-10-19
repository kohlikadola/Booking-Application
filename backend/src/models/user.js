import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
/*export type UserType={
  _id:string;
  firstname:string;
  lastname:string;
  email:string;
  password:string;
}*/
const UserSchema=new mongoose.Schema({
  firstname:{
    type:String,
    required:true
  },
  lastname:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
  },
},{timestamps:true});
//Usr  Middleware
//next->Handled By MongoDB to save it in the 
UserSchema.pre("save",async function (next){
  if(this.isModified('password')){
    this.password=await bcrypt.hash(this.password,10);
  }
  next();
});
const User=mongoose.model("User",UserSchema);
export default User;
