import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation,useQueryClient } from 'react-query';
import * as apiClient from '../api-client';
import {useAppContext} from '../contexts/AppContext.tsx';
import { useNavigate } from "react-router-dom";
export type RegisterFormData={
firstName:string;
lastName:string;
email:string;
password:string;
cnfpassword:string;
}
const Register=()=>{
const queryclient=useQueryClient();
 const navigate=useNavigate();
 const {showToast}=useAppContext();
 const {register,watch,handleSubmit,formState:{errors}}=useForm<RegisterFormData>();
  
  const mutation = useMutation(apiClient.register, {
        onSuccess:async (data) => {
            //console.log("Registration Success");
          showToast({message:"Registration Sucess",type:"SUCCESS"});
          await queryclient.invalidateQueries("validateToken")
          navigate("/");
        },
        onError: (error) => {
            showToast({message:error.message,type:"ERROR"});
            //console.error("Error message:", error.message);
        },
    });
   const onSubmit = handleSubmit(async (data) => {
    console.log("Submitting data:", data);
 mutation.mutate({
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      password: data.password,
    });
    });
  return(
  <form className="flex flex-col gap-5 " onSubmit={onSubmit}>
  <h2 className="text-3xl font-bold">Create an Account</h2>
  <div className="flex flex-col md:flex-row gap-5">
  <label className="text-gray-700 text-sm font-bold flex-1">
  First Name
  <input className="border rounded w-full py-1 px-2 font-normal"{...register("firstName",{required:"This field is required"})}></input>
  {errors.firstName &&(
  <span className="text-red-500">{errors.firstName.message}</span>
      )}
  </label>
  <label className="text-gray-700 text-sm font-bold flex-1">
  Last Name
  <input className="border rounded w-full py-1 px-2 font-normal"{...register("lastName",{required:"This field is required"})}></input>
    {errors.lastName &&(
  <span className="text-red-500">{errors.lastName.message}</span>
      )}
  </label></div>
  <label className="text-gray-700 text-sm font-bold flex-1">
  Email
  <input autoComplete="new-email" type="email" className="border rounded w-full py-1 px-2 font-normal"{...register("email",{required:"This field is required"})}></input>
    {errors.email &&(
  <span className="text-red-500">{errors.email.message}</span>
      )}
  </label>
  <label className="text-gray-700 text-sm font-bold flex-1">
  Password 
  <input autoComplete="new-password" type="password" className="border rounded w-full py-1 px-2 font-normal"{...register("password",{required:"This field is required",minLength:{
  value:6,
  message:"Password needs to be at least 6 charachters"
  },
    })}></input>
  {errors.password && (
  <span className="text-red-500">{errors.password.message}</span>
      )}
    
  </label>
  <label className="text-gray-700 text-sm font-bold flex-1">
  Confirm Password
  <input autoComplete="new-password" type="password" className="border rounded w-full py-1 px-2 font-normal"{...register("cnfpassword",{
validate:(val)=>{
if(!val){
return "This field is reqd."
}
else if(watch("password")!==val){
return "Your Password don't match";
}
},
      })}></input>
  {errors.cnfpassword && (
  <span className="text-red-500">{errors.cnfpassword.message}</span>
      )}

  </label>
  <span><button type="submit" className="rounded bg-blue-600 p-3 text-white font-bold hover:bg-blue-500 text-xl">Create Account</button></span>
  </form>
      );
};

export default Register;
