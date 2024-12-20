import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import {loadStripe,Stripe} from "@stripe/stripe-js";

const PUB=import.meta.env.VITE_STRIPE_PUB || "";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContextType = {
  showToast: (toastMessage: ToastMessage) => void;
  isLog: boolean;
  logOut: () => void;
 stripePromise: Promise<Stripe | null>;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);
const stripePromise=loadStripe(PUB);
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {

  const [isLog, setIsLog] = useState(true);
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  
 const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
    onError: (error) => {
         },
  });

 
  const showToast = (toastMessage: ToastMessage) => {
    setToast(toastMessage);
  };

 const logOut = () => {
    showToast({ message: "Logged out successfully", type: "SUCCESS" }); // Notify user upon logout
  };

  return (
    <AppContext.Provider value={{ 
      showToast,
      isLog: !isError,
      stripePromise,
      logOut,
    }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(undefined)} />}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

