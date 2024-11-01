/*
 * Use This Script For Migration of Past records
 * */



/*import mongoose from 'mongoose';
import Hotel from './models/hotels.js';// MongoDB connection URI
const uri =MONGOURI

async function checkRecords() {
    try {
        const records = await Hotel.find({});
        console.log(`Total records found: ${records.length}`);
        records.forEach((record, index) => {
            console.log(`Record ${index + 1}:`, record);
        });
    } catch (error) {
        console.error('Error fetching records:', error);
    }
}

async function updateRoomsField() {
    try {
        const result = await Hotel.updateMany(
            { rooms: { $exists: false } }, // Find records without the 'rooms' field
            { $set: { rooms: 0 } } // Set 'rooms' to a default value (e.g., 0)
        );

        console.log(`${result.modifiedCount} records updated.`); // Log the count of updated records
    } catch (error) {
        console.error('Error updating records:', error);
    }
}

async function main() {
    try {
        await mongoose.connect(uri); // Connect to MongoDB

        await checkRecords(); // Check for existing records in the hotels collection
        await updateRoomsField(); // Call the update function
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await mongoose.disconnect(); // Ensure the connection is closed
    }
}

main().catch(console.error);
*/

