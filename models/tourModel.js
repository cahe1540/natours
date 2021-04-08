const mongoose = require('mongoose');
const slugify = require('slugify');
/* const User = require('./userModel'); */
//const validator = require('validator');

//define the schema for data sent to our database
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name.'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have more than 40 characters'],
    minlength: [10, 'A tour name must have more than 10 characters'],
    //validate: [validator.isAlpha, 'Tour name must only contain characteres.']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a max group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
       message: 'A tour must be either easy, medium or difficult'
      }
  },
  ratingsQuantity: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be greater than 1.0'],
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    set: val => Math.round(val* 10)/10,
    message: 'Rating ({VALUE}) should be between 0 and 5.'

  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price.'],
  },
  priceDiscount:{ 
    type: Number,
    validate: {
      //the 'this' keyword only exists for creating new documents, not for updates
      validator: function(val) {
        return this.price > val;
      }
    },
    message: 'Discount price ({VALUE}) should be below the regular price.'
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a descriptoin'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image.'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    defualt: false
  },
  startLocation: {
    //GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [{
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    address: String,
    description: String,
    day: Number
  }],
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    } 
  ]
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

tourSchema.index({price: 1, ratingsAverage: -1});
tourSchema.index({slug: 1});
tourSchema.index({startLocation: '2dsphere'});

//Virtual fields
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration/7;
});

//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});


//DOCUMENT MIDDLEWARE  
tourSchema.pre('save', function (next) {      //note: save => save() or create() only
  this.slug = slugify(this.name, {lower: true});
  next();
});

/* 
//embedding of tour guides
tourSchema.pre('save', async function(next){
  const guidesPromises = this.guides.map( async id => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
}); */

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: {$ne: true} });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next){
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // eslint-disable-next-line no-console
  /* console.log(`Query took ${Date.now()} - ${this.start} ms`); */
  next();
});

/* //aggregation middleware
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({'$match': {
      secretTour: {$ne: true}
    }});
    // eslint-disable-next-line no-console
    console.log(this.pipeline());
    next();
});
 */

//define the model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
