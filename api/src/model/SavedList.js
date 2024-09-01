import mongoose, { Schema } from 'mongoose';
import HistoricalEvent from './historicalEvents.js';

const savedListSchema = new mongoose.Schema({
  title: { type: String },
  historicalEvents: [{ type: Schema.Types.ObjectId, ref: 'HistoricalEvent' }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

savedListSchema.pre('remove', async function () {
  await HistoricalEvent.deleteMany({ savedList: this._id });
});

const SavedList = mongoose.model('SavedList', savedListSchema, 'SavedList'); // name and specify model use schema as shape of the model

export default SavedList;
