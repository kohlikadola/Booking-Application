import { RegisterFormData } from './pages/Register';
import SignInFormData from "./pages/SignIn"
import {HotelType,HotelSearchResponse,UserType,PaymentIntentResponse} from "./forms/tpes.ts";
const API_BASE_URL = import.meta.env.VITE_API_URL || '';


export const fetchCurrentUser=async():Promise<UserType>=>{
  const res=await fetch(`${API_BASE_URL}/api/users/me`,{
    credentials:"include",
  });
  if(!res.ok){
    throw new Error("ERRRRR");
  }
  return res.json();
};
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
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 60 seconds timeout
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
      method: "POST",
      credentials: "include",
      body: hotelFormData,
      signal: controller.signal, // attach signal for timeout
    });

    if (!response.ok) {
      const errorMessage = await response.text(); // Get error message from server response
      throw new Error(`Failed to add hotel: ${errorMessage}`);
    }

    return await response.json(); // return the parsed JSON response

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error("Request timed out");
    } else {
      throw new Error(error.message || "An unknown error occurred");
    }
  } finally {
    clearTimeout(timeoutId); // clear the timeout once the request is finished
  }
};


export const fetchMyHotels=async():Promise<HotelType[]>=>{
  const res=await fetch(`${API_BASE_URL}/api/my-hotels`,{
    credentials:"include",
  });
  if(!res.ok){
    throw new Error("Error Occured")
  }
  return res.json();
};

export const fetchMyHotelsById=async(hotelId:string):Promise<HotelType>=>{
  const res=await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`,{
    credentials:"include",
  });
  if(!res.ok){
    throw new Error("Error Occured");
  }
  return res.json();
};


export const updateMyHotelsById=async(hotelFormData:FormData)=>{
  const res=await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,{
    method:"PUT",
    body:hotelFormData,
    credentials:"include"
  });
  if(!res.ok){
    throw new Error("Error Occured");
  }
    return res.json();
};

export type SearchParams={
  destination?:string;
  checkIn?:string;
  checkOut?:string;
  adultCount?:string;
  childCount?:string;
  page?:string;
  facilities?:string[];
  types?:string[];
  stars?:string[];
  maxPrice?:string;
};

export const searchHotels=async(searchParams : SearchParams):Promise<HotelSearchResponse>=>{
  const queryParams=new URLSearchParams();
  queryParams.append("destination",searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || "");
  queryParams.append("childCount", searchParams.childCount || "");
  queryParams.append("page", searchParams.page || "");
  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOption", searchParams.sortOption || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));


  const res=await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`);
  if(!res.ok){
    throw new Error("ERRRRRRRRRR!!!!");
  }

  return res.json();
};
export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels`);
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  return response.json();
};

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};
export const createPaymentIntent=async(hotelId:string,nights:string,kamre:string):Promise<PaymentIntentResponse>=>{
  const res=await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`,{
    credentials:"include",
    method:"POST",
    body:JSON.stringify({nights,kamre}),
    headers:{
      "Content-Type":"application/json", 
    }
  });
  if(!res.ok){
    throw new Error("ERRRRRRRRRRRRRR");
  }
  return res.json();
};
