//Search + Payment API
import express from 'express';
import {param,validationResult} from 'express-validator';
import verifyToken from '../middleware/auth.js';
import Hotel from '../models/hotels.js';
import Stripe from 'stripe';
const stripe=new Stripe(process.env.STRIPE);
const router = express.Router();
router.get("/search", async (req, res) => {
  try {
    const query = constructSearchQuery(req.query);
    let sortOptions={};
    switch(req.query.sortOption){
      case "starRating":
        sortOptions={starRating:-1};
        break;
      case "pricePerNightAsc":
        sortOptions={pricePerNight:1};break;
      case "pricePerNightDsc":
        sortOptions={pricePerNight:-1};break;
    };
    const pageSize = 5;
    const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query).sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});
router.get("/:id",[
  param("id").notEmpty().withMessage("Hotel Id is Required")
],async(req,res)=>{
  const err=validationResult(req);
  if(!err.isEmpty()){
    return res.status(400).json({errors:err.array()});
    
  }
  const id=req.params.id
  try{
    const hotel=await Hotel.findById(id);
    res.status(200).json(hotel);
  }catch(e){
    console.log(e);
    res.status(500).json({message:"Something went wrong"});
  }
});


router.post("/:hotelId/bookings/payment-intent",verifyToken,async()=>{
  //Cost
  //Available Resource
  //HotelId+UserId
  const {nights,kamre}=req.body;
  const hotelId=req.params.hotelId;
  const hotel=await Hotel.findById(hotelId);
  if(!hotel){
    return res.status(400).json({message:"Hotel Not Found"});
  }
  if(!hotel.rooms || hotel.rooms<0){
    return res.status(400).json({message:"No rooms available"});
  }
  if(kamre>hotel.rooms){
    return res.status(400).json({message:`Only ${hotel.rooms} are available`});
  }
  const totalcost=hotel.pricePerNight*nights*kamre;
  const payment=await stripe.paymentIntents.create({
    amount:totalCost,
    currency:"inr",
    metadata:{
      hotelId,
      userId:req.userId,
    },
  });
  if(!payment.client_secret){
    return res.status(500).json({message:"ErRRRRRRR!!!!"});
  }
  const reso={
    paymentIntentId:payment.id,
    clientSecret:payment.client_secret.toString(),
    totalcost,
  };
  hotel.rooms-=kamre;
  await hotel.save();
  res.send(reso);

});
router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req, res) => {
    try {
      const paymentIntentId = req.body.paymentIntentId;

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (!paymentIntent) {
        return res.status(400).json({ message: "Payment intent not found" });
      }

      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "Payment intent mismatch" });
      }

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `Payment intent not succeeded. Status: ${paymentIntent.status}`,
        });
      }

      // Create the newBooking object to match the bookingSchema
      const newBooking = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        bookedrooms: req.body.bookedrooms,
        email: req.body.email,
        adultCount: req.body.adultCount,
        childCount: req.body.childCount,
        checkIn: new Date(req.body.checkIn),
        checkOut: new Date(req.body.checkOut),
        userId: req.userId,
        totalCost: req.body.totalCost,
      };

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId },
        {
          $push: { bookings: newBooking },
        }
      );

      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      await hotel.save();
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);
const constructSearchQuery = (queryParams) => {
  let constructedQuery = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }
    if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  /*if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }*/
  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star) => parseInt(star))
      : [parseInt(queryParams.stars)];

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice),
    };
  }

  return constructedQuery;
};

export default router;
