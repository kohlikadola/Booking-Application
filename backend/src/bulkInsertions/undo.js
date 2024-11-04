/*EXECUTE ONLY WHEN YOU HAVE TO POPULATE YOUR DEVELOPMENT PROJECT

import mongoose from 'mongoose';
import Hotel from '../models/hotels.js'; // Adjust the path as necessary

// MongoDB connection string
const mongoURI =
  async function deleteTodaysHotels() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Get the start and end of today's date
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Delete hotels last updated today
    const result = await Hotel.deleteMany({
      lastUpdated: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    console.log(`Deleted ${result.deletedCount} hotels last updated today.`);
  } catch (error) {
    console.error('Error deleting hotels:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Execute the function
deleteTodaysHotels();
*/
