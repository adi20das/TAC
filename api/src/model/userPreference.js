import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  preference: {
    type: String,
    required: true,
  },
});

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema, 'UserPreference');

export default UserPreference;
