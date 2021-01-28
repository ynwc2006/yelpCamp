const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const {campgroundSchema}=require('./schemas.js')
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
const methodeOverride=require('method-override');
const Campground=require('./models/campground');
const { privateEncrypt } = require('crypto');
const { required } = require('joi');

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

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set ('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true})) //enable to parse the URL
app.use(methodeOverride('_methode'));

//validation middleware
const validateCampground=(req,res,next)=>{
   
    const {error}= campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        //console.log(error.details);
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}


app.get('/', (req, res)=>{
    res.render('home')
})

// app.get('/makecampground', async (req, res)=>{
//     const camp=new Campground({titiel: 'My Background', description: 'cheap'});
//     await camp.save();
//     res.send(camp)
// })


app.get('/campgrounds', catchAsync(async(req, res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}))

//create new
app.get('/campgrounds/new', (req,res)=>{ //must before show, otherwise, new is treated as :id
    res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground,catchAsync(async (req,res,next)=>{
    //if(!req.body.campground) throw new ExpressError('Invalid Campground data',400)
   const campground=new Campground(req.body.campground);
        console.log(campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)
    
}))

//show
app.get('/campgrounds/:id', catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground})
}))

//update
app.get('/campgrounds/:id/edit', catchAsync(async (req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground})
}))

app.put('/campgrounds/:id', validateCampground,catchAsync(async (req, res)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground},{new:true});    
    res.redirect(`/campgrounds/${campground._id}`)
}))

//delete
app.delete('/campgrounds/:id',catchAsync(async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

//error handling
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    if(!err.message) err.message='Oh No, something went wrong!'
    const {statusCode=500} =err;
    res.status(statusCode).render('error',{err});
    //res.send("Oh Boy, somthing went wrong")
})



app.listen(3000,()=>{
    console.log('Serving on port 3000')
})