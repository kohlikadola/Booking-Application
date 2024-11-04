/*
 *FLOOD DB
 * import mongoose from 'mongoose';
import User from '../models/user.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

async function bulkInsertUsers() {
  try {
        await mongoose.connect();
    console.log('Connected to MongoDB');

  
    const users = await Promise.all(
      Array.from({ length: 100 }, async () => {
        const firstname = faker.person.firstName();
        const lastname = faker.person.lastName();
        const email = faker.internet.email();
        const password = await bcrypt.hash('password123', 10); // Hash the password
        
        const userEntry = {
          firstname,
          lastname,
          email,
          password,
        };

       
        console.log('Generated user entry:', userEntry);
        return userEntry;
      })
    );

   
    const result = await User.insertMany(users);
    console.log(`Inserted ${result.length} users successfully`);
  } catch (error) {
    console.error('Error inserting users:', error);
  }
}

bulkInsertUsers();
*/
