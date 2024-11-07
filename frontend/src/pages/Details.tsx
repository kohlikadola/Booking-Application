import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import G from '../forms/Guest.tsx'


const Detail = () => {
  const { hotelId } = useParams();

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  if (!hotel) {
    return <div>NotFound</div>;
  }

  return (
    <div>
      <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map(() => (
            <AiFillStar className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
        <h1 className="text-xl font-bold">{hotel.city} {hotel.country}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">{hotel.imageUrls.map((Img)=>(
      <div className="h-[300px]"><img src={Img} alt={hotel.name} className="rounded-md w-full h-full object-cover object-center"  /></div>
            ))}</div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      {hotel.facilities.map((f)=>(
      <div className="border rounded border-slate-300 rounded-sm p-3">{f}</div>
            ))}
      </div>
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit"><G hotelId={hotel._id} pricePerNight={hotel.pricePerNight} />        </div>
      </div>
    </div>
  );
};

export default Detail;
