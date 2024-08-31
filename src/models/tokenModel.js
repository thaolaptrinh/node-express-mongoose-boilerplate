import mongoose from 'mongoose';

const types = ['refresh', 'resetPassword', 'verifyEmail'];

const tokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        token: {
            type: String,
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: types,
            required: true,
        },
        blacklisted: {
            type: Boolean,
            default: false,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Add a method to set a token as expired
tokenSchema.methods.expire = async function () {
    const token = this;
    token.expiresAt = new Date();
    await token.save();
};

// Add a method to blacklist a token
tokenSchema.methods.blacklist = async function () {
    const token = this;
    token.blacklisted = true;
    await token.save();
};

const Token = mongoose.model('Token', tokenSchema);

export default Token;
