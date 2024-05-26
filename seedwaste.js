const mongoose = require('mongoose');
const Wasteproduct = require('./models/wasteproduct');
const User=require('./models/user')
const data = [
    {
        title: 'Plastic Cans',
        image: 'https://images.unsplash.com/photo-1562077981-4d7eafd44932?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        type: 'Plastic Waste',
        quantity: 20,
        description: 'Lots of Water Cans',
        author: '6642eccf24a39b4648bd0383' // Assuming author ID
    },
    {
        title: 'Rotten Onions',
        image: 'https://images.unsplash.com/photo-1516711345667-ebafb3ebea12?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        type: 'Food Waste',
        quantity: 10,
        description: 'Smells very bad',
        author: '6642eccf24a39b4648bd0383'
    },
    {
        title: 'Iron',
        image: 'https://images.unsplash.com/photo-1591643958857-e6623f63c0e5?q=80&w=2849&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        type: 'Metal Waste',
        quantity: 100,
        description: 'Rusty and old',
        author: '6642eccf24a39b4648bd0383'
    },
    {
        title: 'Bottles',
        image: 'https://images.unsplash.com/photo-1571727153934-b9e0059b7ab2?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        type: 'Plastic Waste',
        quantity: 12,
        description: '12 Plastic Water Bottles',
        author: '6642eccf24a39b4648bd0383'
    },
    {
        title: 'Plastic Covers',
        image: 'https://images.unsplash.com/photo-1565886728041-a239b6a3ec42?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        type: 'Plastic Waste',
        quantity: 3,
        description: 'Plastic Covers',
        author: '6642eccf24a39b4648bd0383'
    },
    {
        title: 'Old School Books',
        image: 'https://images.unsplash.com/photo-1491841651911-c44c30c34548?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        type: 'Paper Waste',
        quantity: 20,
        description: 'School Books',
        author: '6642eccf24a39b4648bd0383'
    }
];


async function seedData() {
    try {
        // Clear existing data
        await Wasteproduct.deleteMany({});

        // Insert new data
        await Wasteproduct.insertMany(data);

        console.log('Data seeded successfully');

        // Find the user with the provided author ID
        const authorId = '6642eccf24a39b4648bd0383'; // Assuming author ID
        const user = await User.findById(authorId);

        if (user) {
            // Update the user's redeem points to 600
            user.redeemPoints = 600;
            await user.save();
            console.log('User redeem points updated successfully');
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        // Close the connection
        mongoose.disconnect();
    }
}

// Connect to MongoDB and seed the data
mongoose.connect('mongodb://localhost:27017/waste-app');
const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
    seedData();
});
