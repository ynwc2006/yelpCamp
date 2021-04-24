
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
    for(let i=0;i<300;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author: "60580b4f4816a010a84aa82f",//user id of asd
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images:[
                {
                  
                    url: 'https://res.cloudinary.com/djki2muxd/image/upload/v1617833466/YelpCamp/ocg5bk3p3d2rw3jqxeet.jpg',
                    filename: 'YelpCamp/ocg5bk3p3d2rw3jqxeet'
                  },
                  {
               
                    url: 'https://res.cloudinary.com/djki2muxd/image/upload/v1617833466/YelpCamp/f6l4aq1uawkkfdkgwrwu.jpg',
                    filename: 'YelpCamp/f6l4aq1uawkkfdkgwrwu'
                  },
                  {
               
                    url: 'https://res.cloudinary.com/djki2muxd/image/upload/v1617833466/YelpCamp/w0ecl0iks5eyz3cpofxf.jpg',
                    filename: 'YelpCamp/w0ecl0iks5eyz3cpofxf'
                  },
                  {
        
                    url: 'https://res.cloudinary.com/djki2muxd/image/upload/v1617833466/YelpCamp/tufa4amho4tqgfrizha6.jpg',
                    filename: 'YelpCamp/tufa4amho4tqgfrizha6'
                  },
                  {
         
                    url: 'https://res.cloudinary.com/djki2muxd/image/upload/v1617833466/YelpCamp/epooerlvedsopjbprh6e.jpg',
                    filename: 'YelpCamp/epooerlvedsopjbprh6e'
                  }
            ],
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic aut amet deserunt laudantium deleniti perferendis aliquam pariatur vel voluptates. Nesciunt, quaerat esse! Consectetur veniam, in recusandae maxime esse possimus exercitationem.",
            price,
            geometry: { 
              coordinates: [cities[random1000].longitude,cities[random1000].latitude],
              type: 'Point' 
            },
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})