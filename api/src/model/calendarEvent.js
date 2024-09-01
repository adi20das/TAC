import mongoose from 'mongoose';

const calendarEventSchema = new mongoose.Schema({
  title: { type: String },
  location: { type: String },
  startTime: { type: Date },
  endTime: { type: Date },
  reminderTime: { type: Date },
  allDay: { type: Boolean },
  description: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema, 'CalendarEvent'); // name and specify model use schema as shape of the model

export default CalendarEvent;
