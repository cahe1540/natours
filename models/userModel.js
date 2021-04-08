const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please tell us your name.'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
    },
    passwordConfirmed: {
        type: String, 
        required: [true, 'Please confirm your password'],
        validate: {
            //this ONLY works on create and save!!!
            validator: function(el){
                return el === this.password;
            },
            message: "Passwords do not match. "
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

//Schema Pre MiddleWare
userSchema.pre(/^find/, function(next){
    //this points to current query
    this.find({active: {$ne:false}});
    next();
});

userSchema.pre('save', async function(next){
    //only run this if password was modified
    if(!this.isModified('password')) return next();

    //hash pasword with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    
    //delete the passwordConfirmed field
    this.passwordConfirmed = undefined;
})

userSchema.pre('save', function (next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
})

//Schema Methods
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

userSchema.methods.correctPassword = async function(candidatePassword, UserPassword){
    return await bcrypt.compare(candidatePassword, UserPassword);
}

userSchema.methods.changePasswordAfter = function(JWTTimeStamp) {
    let changedTimestamp;
    if(this.passwordChanged) {
        changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);
    }

    //false means NOT changed
    return JWTTimeStamp < changedTimestamp; 
}


const User = mongoose.model('User', userSchema);

module.exports = User;