const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const methodeOverride=require('method-override')
const Campground=require('./models/campground')

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

const app=express();


app.set('view engine', 'ejs');
app.set ('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true})) //enable to parse the URL
app.use(methodeOverride('_methode'));

app.get('/', (req, res)=>{
    res.render('home')
})

// app.get('/makecampground', async (req, res)=>{
//     const camp=new Campground({titiel: 'My Background', description: 'cheap'});
//     await camp.save();
//     res.send(camp)
// })


app.get('/campgrounds', async(req, res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
})

//create new
app.get('/campgrounds/new', (req,res)=>{ //must before show, otherwise, new is treated as :id
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req,res)=>{
    const campground=new Campground(req.body.campground);
    console.log(campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

//show
app.get('/campgrounds/:id', async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground})
})

//update
app.get('/campgrounds/:id/edit', async (req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground})
})

app.put('/campgrounds/:id', async (req, res)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground},{new:true});    
    res.redirect(`/campgrounds/${campground._id}`)
})

//delete
app.delete('/campgrounds/:id',async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})


app.listen(3000,()=>{
    console.log('Serving on port 3000')
})