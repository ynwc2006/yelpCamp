const express=require('express');
const router=express.Router();
const campgrounds=require('../controllers/campgrounds');
const catchAsync=require('../utils/catchAsync');
const Campground=require('../models/campground');
const {isLoggedIn, isAuthor,validateCampground}=require('../middleware');
const multer  = require('multer');
const {storage}=require('../cloudinary');
const upload = multer({storage});



/* router.get('/', catchAsync(campgrounds.index));

//create new
router.get('/new', isLoggedIn,campgrounds.renderNewForm)

router.post('/', isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground))

//show
router.get('/:id', catchAsync(campgrounds.showCampground))

//update
router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.renderEditForm))

router.put('/:id',isLoggedIn,isAuthor, validateCampground,catchAsync(campgrounds.updateCampground))

//delete
router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))
 */


router.route('/')
    .get( catchAsync(campgrounds.index))
    .post( isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground))
   //upload is part of Multer middleware, it adds text to req.body, and file to req.file/files
        
        //console.log(req.body);
        //console.log(req.files);
       


router.get('/new', isLoggedIn,campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor, upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))


//update
router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.renderEditForm))






module.exports=router;
