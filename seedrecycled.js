const mongoose = require('mongoose');
const Recycledproduct = require('./models/recycledproduct');

const data = [
    {
      title: 'Woven Bowls',
      image: 'https://i.etsystatic.com/18965075/c/2250/2250/187/0/il/35b106/2704111117/il_600x600.2704111117_59xg.jpg',
      type: 'Plastic Waste',
      price: 10,
      description: 'These handcrafted bowls are made from re-purposed plastic materials, so they are sustainable and ethically made! They are handcrafted with care by Nepali artisans in the Ruby Valley and are sure to spruce up any room in the house!\r\n',
      author: '663dcdc74a800ba5fa931747'
    },
    {
      title: 'African Upcycled Coffee Pod Elephant',
      image: 'https://i.etsystatic.com/25724549/r/il/16b604/5071238812/il_1588xN.5071238812_5r0w.jpg',
      type: 'Food Waste',
      price: 200,
      description: 'Made from Upcycled coffee pods, wire',
      author: '663dcdc74a800ba5fa931747'
    },
    {
      title: 'Money Purse',
      image: 'https://i.etsystatic.com/28529436/r/il/ddd001/3258128781/il_1588xN.3258128781_tqpk.jpg',
      type: 'Textile Waste',
      price: 50,
      description: 'Handmade from recycled farming sacks in Vietnam. It has two compartments, each with a zipper.\r\n' +
        'It very durable, water resistant and super stylish',
      author: '663dcdc74a800ba5fa931747'
    },
    {
      title: 'Plant Pot',
      image: 'https://i.etsystatic.com/22204842/r/il/963f0e/5994473633/il_600x600.5994473633_44i1.jpg',
      type: 'Organic Waste',
      price: 50,
      description: 'Made from recycled wood, ecofriendly product, sustainable design, wood filament, beach',
      author: '663dcdc74a800ba5fa931747'
    },
    {
      title: 'Hair Comb ',
      image: 'https://i.etsystatic.com/15896886/r/il/d88c2e/5889148397/il_1588xN.5889148397_tpu9.jpg',
      type: 'Plastic Waste',
      price: 20,
      description: `Crafted from recycled plastic, our long comb is here to prove that a sweet hair style doesn’t have to cost the Earth - literally. Whether you're creating a work of hair art or just untangling one of life's messes (hair-related or otherwise), it's the perfect partner for crafting 'dos that will make heads turn faster than you can say "hot damn, they’re some environmentally responsible follicles". So, go ahead and elevate your hair game while lowering your carbon footprint – it's a win-win without having a single a hair out of place.`,
      author: '663dcdc74a800ba5fa931747'
    },
    {
      title: 'Tote Bag',
      image: 'https://i.etsystatic.com/23028465/r/il/d0731f/5898103185/il_1588xN.5898103185_9rn3.jpg',
      type: 'Textile Waste',
      price: 100,
      description: 'Hand Made from Recycled Jeans\r\n\r\n\r\n',
      author: '663dcdc74a800ba5fa931747'
    },
    {
      title: 'Photo Frames',
      image: 'https://i.etsystatic.com/19887624/r/il/8a9d6c/4456853028/il_1588xN.4456853028_ohfj.jpg',
      type: 'Paper Waste',
      price: 400,
      description: 'Hand crafted from recycled newspaper, each one is as unique as it is colourful. The perfect planet-friendly present to celebrate a new home, wedding or birthday.',
      author: '663e7a45a60a47c093e663e6'
    },
    {
      title: 'Plastic Bottle Roses ',
      image: 'https://i.etsystatic.com/6302189/r/il/aaddd8/3029336847/il_1588xN.3029336847_f6nq.jpg',
      type: 'Plastic Waste',
      price: 100,
      description: 'The discarded plastic bottles are truly upcycled and it is a struggle to tell what the flowers have been made from. Each individual petal is hand cut, sandblasted to turn them white then dyed the vibrant colours. The petals are then sculpted and assembled around a stem made from stainless steel.',
      author: '663e7a45a60a47c093e663e6'
    },
    {
      title: 'Recycled Small Day Tote',
      image: 'https://i.etsystatic.com/5864582/r/il/1afd4f/5927648335/il_1588xN.5927648335_dcnp.jpg',
      type: 'Organic Waste',
      price: 100,
      description: 'Purse tote in the house! Great for a day bag',
      author: '663e7a45a60a47c093e663e6'
    }
];


async function seedData() {
    try {
        // Clear existing data
        await Recycledproduct.deleteMany({});

        // Insert new data
        await Recycledproduct.insertMany(data);

        console.log('Data seeded successfully');
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
