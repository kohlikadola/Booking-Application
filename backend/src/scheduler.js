import cron from 'node-cron';
import Hotel from './models/hotels.js';

export const initRoutine=()=>{
  cron.schedule('0 0 * * * ',async()=>{
    try{
      const curr=new Date();
      const hotels=await Hotel.find();
      for(const h of hotels){
        for (const b of h.bookings){
          const now=new Date();
          if(b.checkOut<now){
            h.rooms+=b.bookedrooms;
            h.bookings=h.bookings.filter(B=>B._id.toString()!== b._id.toString());
            await h.save();
          }
        }
      }

    }catch(e){
      console.log(e);
    }
  })
}
