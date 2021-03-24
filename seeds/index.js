
const mongoose=require('mongoose');
const cities=require('./cities');
const {places, descriptors}=require('./seedHelpers')
const Campground=require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

const sample=(array)=> array[Math.floor(Math.random()*array.length)];

const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author: "60580b4f4816a010a84aa82f",//user id of asd
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic aut amet deserunt laudantium deleniti perferendis aliquam pariatur vel voluptates. Nesciunt, quaerat esse! Consectetur veniam, in recusandae maxime esse possimus exercitationem.",
            price
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})