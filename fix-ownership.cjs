const mongoose = require('mongoose');
const Club = require('./api/models/Club');
const User = require('./api/models/User');
// Note: We'll try to connect to the common dev URI.
// If it's the memory server, this script might fail to connect to the *running* instance,
// but usually dev environments use a fixed local Mongo or a shared URI.

const transferOwnership = async () => {
    try {
        const mongoUri = 'mongodb://localhost:27017/club-management';
        await mongoose.connect(mongoUri);
        console.log('Connected to DB');

        const oldPrezId = '696986d52537ea84a73a5621'; // From screenshot
        const newPrezId = '696987292537ea84a73a562e'; // current logged in user

        const result = await Club.updateMany(
            { president: oldPrezId },
            { $set: { president: newPrezId } }
        );

        console.log(`Updated ${result.modifiedCount} clubs.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

transferOwnership();
