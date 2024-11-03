import { useMutation } from "react-query";
import * as apiClinet from "../api-client.ts";
import { useAppContext } from "../contexts/AppContext";
import {useNavigate} from "react-router-dom";
const SignOutButton=()=>{
  const navigate=useNavigate();
  const { showToast }= useAppContext();
  const mutation = useMutation(apiClinet.signOut,{
onSuccess:()=>{
showToast({message:"Signed Out!",type:"SUCCESS"});

window.location.reload();
},
onError:(error:Error)=>{
showToast({message:error.message,type:"ERROR"});
},
      });
const handleClick=()=>{
mutation.mutate();
};
return (
  <button onClick={handleClick} className="text-blue-600 px-3 font-bold hover: bg-gray-100">SignOut</button>
      );
};
export default SignOutButton;
