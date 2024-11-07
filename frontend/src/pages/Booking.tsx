import * as apiClient from "../api-client.ts";
import { useQuery } from 'react-query';
import B from '../forms/B.tsx';
import BD from '../components/BD.tsx';
import {useSearchContext} from '../contexts/SearchContext';
import {useAppContext} from '../contexts/AppContext';
import {useParams} from 'react-router-dom';
import {useState,useEffect} from 'react';
import {Elements} from '@stripe/react-stripe-js';
const Booking = () => {
  const search=useSearchContext();
  const {stripePromise}=useAppContext();
  const {id}=useParams();
  const [nights,setnights]=useState<number>(0);
  const [kamre,setkamre]=useState<number>(0);
     useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nightCount = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24);
      setnights(Math.ceil(nightCount));
    }

    if (search.adultCount !== undefined && search.childCount !== undefined) {
      const roomCount = (search.adultCount + search.childCount) / 3;
      setkamre(Math.ceil(roomCount));
    }
  }, [search.checkIn, search.checkOut, search.adultCount, search.childCount]);
  const{data:paymentIntentData} = useQuery("createPaymentIntent",()=>apiClient.createPaymentIntent(hotelId as string,nights.toString(),kamre.toString()),
      {
      enabled:!!id && nights>0 && kamre>0,
      }
  );
  const {data:hotel}=useQuery("fetchHotelById",()=>
      apiClient.fetchHotelById(id as string),{
      enabled:!!id,
      });
  const { data: currentUser } = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser);
  
  if(!hotel){
  return <></>
  }
  return (
    <div className="grid grid-cols-2 gap-4">
      <BD checkIn={search.checkIn} checkOut={search.checkOut} adultCount={search.adultCount} childCount={search.childCount} nights={nights} kamre={kamre} hotel={hotel} />
      {currentUser && paymentIntentData && (
        <Elements stripe={stripePromise}  options={{clientSecret:paymentIntentData.clientSecret}}>;
        <B currentUser={currentUser} paymentIntent={paymentIntentData} /></Elements>)
      }
    </div>
  );
};

export default Booking;

