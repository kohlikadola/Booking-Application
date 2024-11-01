import { useMutation } from 'react-query';
import ManageHotelForm from "../forms/ManageHotelForm.tsx";
import { useAppContext } from '../contexts/AppContext';
import * as apiClient from '../api-client.ts';

const AddHotel = () => {
  const { showToast } = useAppContext();
  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel Saved", type: "SUCCESS" });
    },
    onError: (error: any) => { // Capture the error here
      console.error("Mutation error:", error);
      showToast({ message: "Error: " + (error?.message || "Something went wrong"), type: "ERROR" });
    },
  });

  const handleSave = (handleFormData: FormData) => {
    mutate(handleFormData);
  };

  return <ManageHotelForm isLoading={isLoading} onSave={handleSave} />;
};

export default AddHotel;

