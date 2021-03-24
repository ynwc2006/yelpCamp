const {campgroundSchema, reviewSchema}=require('./schemas.js')
const ExpressError=require('./utils/ExpressError');
const Campground=require('./models/campground');
const Review=require('./models/review');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error','you must be signed in ');
        return res.redirect('/login');
    }
    next();
}


//validation middleware
module.exports.validateCampground=(req,res,next)=>{
    const {error}= campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        //console.log(error.details);
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

//validate if current user is the owner of the campground
module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permittion to do this');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


//validation middleware for reviews
module.exports.validateReview=(req,res,next)=>{
    const {error}= reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        //console.log(error.details);
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

//validate if current user is the owner of the review
module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permittion to do this');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}