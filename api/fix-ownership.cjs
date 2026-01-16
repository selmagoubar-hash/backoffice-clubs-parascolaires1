const mongoose = require('mongoose');

// We need to find the MONGO_URI. 
// If it's the memory server, it's usually dynamic. 
// But let's assume standard local mongo or whatever is in .env

const transferOwnership = async () => {
    try {
        // We'll try to connect to the common dev URI.
        const mongoUri = 'mongodb://localhost:27017/club-management';
        await mongoose.connect(mongoUri);
        console.log('Connected to DB');

        const oldPrezId = '696986d52537ea84a73a5621'; // From screenshot
        const newPrezId = '696987292537ea84a73a562e'; // current logged in user

        // Use the model directly if we can't import it easily
        const Club = mongoose.model('Club', new mongoose.Schema({
            president: mongoose.Schema.Types.ObjectId
        }));

        const result = await Club.updateMany(
            { president: new mongoose.Types.ObjectId(oldPrezId) },
            { $set: { president: new mongoose.Types.ObjectId(newPrezId) } }
        );

        console.log(`Updated ${result.modifiedCount} clubs.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

transferOwnership();
