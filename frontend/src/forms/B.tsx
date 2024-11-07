import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

import {UserType} from 'tpes.ts';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import {useForm,PaymentIntentResponse} from 'react-hook-form'; 
type Props={
     currentUser:UserType;
     paymentIntent:PaymentIntentResponse;
};
export type  Form={
     firstname:string;
     lastname:string;
     email:string;
};
const B=({currentUser}:Props)=>{
  const{handleSubmit,register}=useForm<Form>({
defaultValues:{
firstname:currentUser.firstname,
lastname:currentUser.lastname,
email:currentUser.email,
}
      });
      return(
      <form className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
           <label className="text-gray-700 text-sm font-bold flex-1">FirstName <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" type="text" readOnly disabled {...register("firstname")}/></label>
<label className="text-gray-700 text-sm font-bold flex-1">LastName <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" type="text" readOnly disabled {...register("lastname")}/></label>
<label className="text-gray-700 text-sm font-bold flex-1">Email <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" type="text" readOnly disabled {...register("email")}/></label>

      </div>
            <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>

        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: ₹{paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold"> Payment Details</h3>
        <CardElement
          id="payment-element"
          className="border rounded-md p-2 text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
        >
          {isLoading ? "Saving..." : "Confirm Booking"}
        </button>
      </div>
      </form>
      );
};
export default B;
