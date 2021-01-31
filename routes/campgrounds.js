const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const Campground=require('../models/campground');
const {campgroundSchema}=require('../schemas.js')

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

router.get('/', catchAsync(async(req, res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}))

//create new
router.get('/new', (req,res)=>{ //must before show, otherwise, new is treated as :id
    res.render('campgrounds/new')
})

router.post('/', validateCampground,catchAsync(async (req,res,next)=>{
    
    //if(!req.body.campground) throw new ExpressError('Invalid Campground data',400)
   const campground=new Campground(req.body.campground);
        console.log(campground);
        await campground.save();
        req.flash('success', 'Successfully made a new campground!');
        res.redirect(`/campgrounds/${campground._id}`)
    
}))

//show
router.get('/:id', catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error', 'Cannot find the campground!');
        res.redirect('/campgrounds');
    }
    else {
        res.render('campgrounds/show',{campground})
    }
}))

//update
router.get('/:id/edit', catchAsync(async (req,res)=>{
    const campground=await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Cannot find the campground!');
        res.redirect('/campgrounds');
    }else{ res.render('campgrounds/edit',{campground})}

   
}))

router.put('/:id', validateCampground,catchAsync(async (req, res)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground},{new:true});    
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

//delete
router.delete('/:id',catchAsync(async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds')
}))

module.exports=router;
