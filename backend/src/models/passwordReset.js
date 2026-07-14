import mongoose, { Schema, model } from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
      verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
       
    }
});

passwordResetSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 3 * 60, // 3 minute
        partialFilterExpression: { verified: false }
    }
);

passwordResetSchema.index(
    { verifiedAt: 1 },
    {
        expireAfterSeconds: 5 * 60, // 5 minute
        partialFilterExpression: { verified: true }
    }
);

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

export default PasswordReset;