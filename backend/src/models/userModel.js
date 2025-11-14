import bcrypt from "bcryptjs";
import mongoose, { Schema, model } from 'mongoose';

const addressSchema = new mongoose.Schema({
    zip_code: {
        type: String,
        required: [true, 'Zip code is required'],
        match: [/^\d{3,10}$/, "Zip code must be numeric and 3-10 digits"]
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true
    },
    other_address: {
        type: String,
        trim: true
    }
}, { _id: false });

const userSchema = new Schema({
    first_name: {
        type: String,
        required: [true, 'First name is required'],
        minLength: [3, 'First name minimum Length 3 character'],
        maxLength: [10, 'First name maximum Length 10 character'],
        match: [/^[A-Za-z]+$/, "First name can only contain letters"],
        trim: true,
        lowercase: true
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required'],
        minLength: [3, 'Last name minimum Length 3 character'],
        maxLength: [10, 'Last name maximum Length 10 character'],
        match: [/^[A-Za-z]+$/, "Last name can only contain letters"],
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        minLength: [5, 'Username minimum Length 3 character'],
        maxLength: [20, 'Username maximum Length 10 character'],
        match: [/^[A-Za-z0-9]+$/, "Username can only contain letters and numbers"],
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: (value) => {
                // Extra custom validation: no consecutive numbers
                return !/\d{4,}/.test(value);
            },
            message: "Username cannot contain consecutive numbers and maximum consecutive number of 3."
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\+?\d{10,15}$/, "Phone number must be valid"], // +8801234567890 or 0123456789
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password number is required']
    },
    image: {
        type: String,
        default: 'default.png',
        match: [/\.(jpg|jpeg|png|gif)$/i, 'Only image files are allowed'],
        trim: true
    },
    address: {
        type: [addressSchema], // array of addresses
        default: []
    },

    is_banned: {
        type: Boolean,
        default: false
    },

    is_admin: {
        type: Boolean,
        default: false
    },

    email_verified: {
        type: Boolean,
        default: false
    },

    sms_verified: {
        type: Boolean,
        default: false
    },

    twofa_verified: {
        type: Boolean,
        default: false
    },
    var_code: {
        type: Number,
        trim: true
    }

}, { timestamps: true });

// 🔹 Pre-save hook to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 🔹 Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


const User = model('User', userSchema);
export default User;

