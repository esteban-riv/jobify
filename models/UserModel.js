import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    lastName: {
        type: String,
        default: 'my last name'
    },
    location: {
        type: String,
        default: 'my city'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
    },
    avatarPublicId: {
        type: String,
    },

}, { timestamps: true });

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

export default mongoose.model('User', UserSchema);