import { RegisterFormData } from './pages/Register';
import SignInFormData from "./pages/SignIn"
//const API_URI = import.meta.env.VITE_API_URL;

export const register = async (formData: RegisterFormData) => {
  try {
    const Api=import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${Api}/api/users/register`, { // Use the API_URI here
      method: 'POST',
      credentials:'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstname: formData.firstname, // Use 'firstname' as in your backend
        lastname: formData.lastname,   // Use 'lastname' as in your backend
        email: formData.email,
        password: formData.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Network response was not ok');
    }

    const result = await response.json();
    console.log("Registration Success:", result);
    return result; // Return the result
  } catch (error) {
    console.error("Registration error:", error.message);
    throw error; // Re-throw the error for further handling
  }
};
/*
export const validateToken = async()=>{
  const API_URI=import.meta.env.VITE_API_URL;
  const res=await fetch(`${API_URI}/api/auth/validate-token`,{
    
    credentials:"include"
  });
  if(!res.ok){
    throw new Error("Invalid Token");
  }
};
*/
export const signIn=async(formData:SignInFormData)=>{
   const Api=import.meta.env.VITE_API_URL || '';
   const res=await fetch(`${Api}/api/auth/login`,{
     method:"POST",
     credentials:"include",
     headers:{
       "Content-Type":"application/json"
     },
     body:JSON.stringify(formData),
   });
   const body=await res.json();
   if(!res.ok){
     throw new Error(body.message);
   }
   return body;
}
export const validateToken = async()=>{
  const API_URI=import.meta.env.VITE_API_URL || '';
  const res=await fetch(`${API_URI}/api/auth/validate-token`,{
    
    credentials:"include"
  });
  if(!res.ok){
    throw new Error("Invalid Token");
  }
  return res.json();
};

export const signOut=async()=>{
  const Api=import.meta.env.VITE_API_URL || '';
  const res=await fetch(`${Api}/api/auth/logout`,{
    credentials:"include",
    method:"POST"
  });
  if(!res.ok){
    throw new Error("Error during Logout");
  }
}





