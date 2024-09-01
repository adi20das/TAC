import mongoose from 'mongoose';
const keysecret = 'jdheyuhgtresdfgvcbjhuioplkiuythg';
import jwt from 'jsonwebtoken';

const AuthSchema = new mongoose.Schema({
  firstname: {
    required: true,
    type: String,
    trim: true,
  },
  lastname: {
    required: true,
    type: String,
    trim: true,
  },
  username: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: 'Please enter a valid email address',
    },
  },
  subscriptionActive: {
    type: String,
    default: '',
  },
  salt: {
    type: String,
    default: '',
  },
  hashPassword: {
    require: true,
    type: String,
    validate: {
      validator: (value) => {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return value.match(re);
      },
      message: 'Your password not meeting requirement',
    },
  },
  selectedAPIs: [
    {
      type: String,
    },
  ],
  verifytoken: {
    type: String,
  },
  calendarEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CalendarEvent',
    },
  ],
  tokem: {
    type: String,
  },
});
AuthSchema.methods.generateAuthtoken = async function () {
  try {
    let newtoken = await jwt.sign({ _id: this._id }, keysecret, {
      expiresIn: '1d',
    });
    console.log('token 23 working');

    this.token = newtoken;
    await this.save();
    console.log('after generate gotkan');
    return newtoken;
  } catch (error) {
    throw error;
  }
};

const UserModel = mongoose.model('User', AuthSchema, 'User');

export default UserModel;
