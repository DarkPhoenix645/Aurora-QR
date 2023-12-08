import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "please enter your name"],
            maxLength: [30, "Name cannot exceed 30 characters"],
            minLength: [3, "Name should have more than 2 characters"],
        },

        email: {
            type: String,
            lowercase: true,
            required: [true, "Please enter your email"],
            unique: [true, "Email already exists"],
            validate: [validator.isEmail, "Please enter a vaild email"]
        },

        phone: {
            type: Number,
            required: [true, "Please enter your phone number"],
            min: [1000000000, "Phone number must be 10 digits (exclude country code)"],
            max: [9999999999, "Phone number must be 10 digits (exclude country code)"],
            unique: [true, "Phone number already taken"],
        },
        
        gender: {
            type: String,
            required: [true, "Please enter your gender"],
        },
        
        college: {
            type: String,
            required: [true, "Please enter your college name"],
        },

        city: {
            type: String,
            required: [true, "Please enter your city"],
        },
        
        password: {
            type: String,
            minlength: [6, "The minimum password length is 6 characters"],
            required: [true, "Please enter your password"]
        },
    
        dob: {
            type: Date,
            required: [true, "Please enter your DOB"],
        },

        // User / Admin
        type: {
            type: String,
            required: [true, "Type of user not set"]
        }
    },
    { timestamps: true }
);

UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email })
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth && user.type) {
            return user
        } 
        throw Error("The given password is incorrect")
    }
    throw Error("The provided email either doesn't exist or is incorrect")
}

const User = mongoose.model('User', UserSchema);
export default User;