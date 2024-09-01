import mongoose, { Schema } from 'mongoose';

var historicalEventsSchema = new mongoose.Schema({
  savedList: { type: Schema.Types.ObjectId, ref: 'SavedList' },
  date: { type: Date },
  title: { type: String },
  description: { type: String },
  url: { type: String },
});

const HistoricalEvent = mongoose.model(
  'HistoricalEvent',
  historicalEventsSchema,
  'HistoricalEvent'
); // name and specify model use schema as shape of the model

export default HistoricalEvent;
