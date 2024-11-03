//SearchAPI
import express from 'express';
import {param,validationResult} from 'express-validator';
import verifyToken from '../middleware/auth.js';
import Hotel from '../models/hotels.js';

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
