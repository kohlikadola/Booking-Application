import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotels.js";
import verifyToken from "../middleware/auth.js";
import { body } from "express-validator";



const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});



router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("rooms").notEmpty().isNumeric().withMessage("Room is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req, res) => {
    try {
      const imageFiles = req.files ;
      const newHotel = req.body;

      const imageUrls = await uploadImages(imageFiles);

      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).send(hotel);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);



router.get('/',verifyToken,async(req,res)=>{
  try{const hotel=await Hotel.find({userId:req.userId});
  res.json(hotel);
  }catch(e){
    console.log(e);
    res.status(500).json({message:"Error in Fetching"});
  }
});
router.get('/:id',verifyToken,async(req,res)=>{
  try{
    const hotel=await Hotel.findOne({
      _id:req.params.id,
      userId:req.userId
    });
    if(!hotel){
      res.status(404).json({message:"Absent Record"});
    }
    res.status(200).json(hotel);
  }catch(e){
    console.log(e);
    res.status(500).json({message:"Something went wrong"});
  }
});




//Update an existing hotel
router.put('/:id',verifyToken,upload.array("imageFiles"),async(req,res)=>{
  try{
    const newhotel=req.body;
    newhotel.lastUpdated=new Date();
    const hotel=await Hotel.findOneAndUpdate({
      _id:req.params.id,
      userId:req.userId
    },
      newhotel,
      {
        new:true
      }
    );
    if(!hotel){
      res.staus(404).json({message:"Absent Entry"});
    }
    const files=req.files;
    const updatedfiles=await uploadImages(files);
    hotel.imageUrls=[
      ...updatedfiles,
      ...(newhotel.imageUrls || [])
    ];
    await hotel.save();
    res.status(201).json(hotel);
  }catch(e){
    console.log(e);
    res.status(500).json({message:"Something went wrong"});
  }
});



async function uploadImages(imageFiles) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;

