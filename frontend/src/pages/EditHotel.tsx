import {useQuery,useMutation} from "react-query";
import {useParams} from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm.tsx";
import {useAppContext} from "../contexts/AppContext.tsx";
const EditHotel=()=>{
     const {hotelId}=useParams();
     const {showToast}=useAppContext();
     const {data:hotel}=useQuery(
     "fetchMyHotelsById",
     ()=>apiClient.fetchMyHotelsById(hotelId || ""),
     {
     enabled:!!hotelId,
     }
     );
     const {mutate,isLoading} = useMutation(apiClient.updateMyHotelsById,{
onSuccess:()=>{
showToast({message:"Hotel Saved",type:"SUCCESS"});
},
onError:()=>{
showToast({message:"Error while Updating",type:"ERROR"});
},
         });
const handleSave=(hotelFormData:FormData)=>{
mutate(hotelFormData);
};
     return <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />;
};
export default EditHotel;
