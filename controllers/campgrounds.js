const Campground=require('../models/campground');

module.exports.index=async(req, res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm=(req,res)=>{ //must before show, otherwise, new is treated as :id
    
    res.render('campgrounds/new')
}

module.exports.createCampground=async (req,res,next)=>{
    
    //if(!req.body.campground) throw new ExpressError('Invalid Campground data',400)
   const campground=new Campground(req.body.campground);
    campground.author=req.user._id;
        //console.log(campground);
        await campground.save();
        req.flash('success', 'Successfully made a new campground!');
        res.redirect(`/campgrounds/${campground._id}`)
    
}

module.exports.showCampground=async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    //console.log(campground);
    if(!campground){
        req.flash('error', 'Cannot find the campground!');
        res.redirect('/campgrounds');
    }
    else {
        res.render('campgrounds/show',{campground})
    }
}

module.exports.renderEditForm=async (req,res)=>{
    const campground=await Campground.findById(req.params.id);
    
    if(!campground){
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground})
}

module.exports.updateCampground=async (req, res)=>{
    const {id}=req.params;
    
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground},{new:true});    
    req.flash('success', 'Successfully updated campground!');
    return res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground=async (req,res)=>{
    const {id}=req.params;
    
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds')
}