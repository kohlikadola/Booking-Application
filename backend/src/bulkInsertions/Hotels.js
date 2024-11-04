/*         ONLY      EXECUTE WHEN YOU NEED TO FLOOD DB
import mongoose from 'mongoose';
import Hotel from '../models/hotels.js';
import { faker } from '@faker-js/faker';
import cloudinary from 'cloudinary';

const MONGO_URI = 
cloudinary.config({

});



const cities = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad',
  'Kolkata', 'Ahmedabad', 'Pune', 'Jaipur', 'Surat',
  'Lucknow', 'Nagpur', 'Visakhapatnam', 'Indore', 'Thane',
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
  'Austin', 'Jacksonville', 'San Francisco', 'Columbus', 'Fort Worth',
  'London', 'Paris', 'Berlin', 'Madrid', 'Rome',
  'Amsterdam', 'Vienna', 'Lisbon', 'Brussels', 'Copenhagen',
  'Barcelona', 'Dublin', 'Prague', 'Stockholm', 'Budapest',
];

const hotelTypes = [
  "Budget", "Boutique", "Luxury", "Ski Resort", "Business",
  "Family", "Romantic", "Hiking Resort", "Cabin", "Beach Resort",
  "Golf Resort", "Motel", "All Inclusive", "Pet Friendly", "Self Catering",
];

const hotelFacilities = [
  "Free WiFi", "Parking", "Airport Shuttle", "Family Rooms",
  "Non-Smoking Rooms", "Outdoor Pool", "Spa", "Fitness Center",
];

async function uploadToCloudinary(imageUrl) {
  try {
    const result = await cloudinary.v2.uploader.upload(imageUrl);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
}

async function bulkInsertHotels() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const userId = '671279b554de64ded6677f1c';
    const uniqueHotelEntries = new Set();

    const hotels = await Promise.all(
      Array.from({ length: 500 }, async () => {
        let hotelEntry;

        do {
          const name = faker.company.name();
          const rooms = Math.floor(Math.random() * 100) + 1;
          const city = cities[Math.floor(Math.random() * cities.length)];
          const country = ['India', 'United States', 'Europe'][Math.floor(cities.indexOf(city) / 15)];
          const description = faker.lorem.sentence();
          const type = hotelTypes[Math.floor(Math.random() * hotelTypes.length)];
          const facilities = Array.from(
            { length: Math.floor(Math.random() * hotelFacilities.length) + 1 },
            () => hotelFacilities[Math.floor(Math.random() * hotelFacilities.length)]
          );
          const adultCount = Math.floor(Math.random() * 5) + 1;
          const childCount = Math.floor(Math.random() * 3);
          const pricePerNight = Math.floor(Math.random() * 300) + 50;
          const starRating = Math.floor(Math.random() * 5) + 1;
          const lastUpdated = new Date();
          const imageUrls = Array.from({ length: 3 }, (_, index) => `https://picsum.photos/200/300?random=${Math.random()}`);
          const cloudinaryUrls = await Promise.all(imageUrls.map(uploadToCloudinary));

          hotelEntry = {
            userId,
            name,
            rooms,
            city,
            country,
            description,
            type,
            adultCount,
            childCount,
            facilities: [...new Set(facilities)],
            pricePerNight,
            starRating,
            imageUrls: cloudinaryUrls.filter(url => url !== null),
            lastUpdated,
            bookings: [],
          };
        } while (uniqueHotelEntries.has(hotelEntry.name));

        uniqueHotelEntries.add(hotelEntry.name);
        console.log('Generated hotel entry:', hotelEntry);
        return hotelEntry;
      })
    );

    const result = await Hotel.insertMany(hotels);
    console.log(`Inserted ${result.length} hotels successfully`);
  } catch (error) {
    console.error('Error inserting hotels:', error);
  }
}

bulkInsertHotels();
*/
