import mongoose from 'mongoose';

const passwordResetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800,
  },
});

const PasswordResetToken = mongoose.model(
  'PasswordResetToken',
  passwordResetTokenSchema,
  'PasswordResetToken'
);

export default PasswordResetToken;
