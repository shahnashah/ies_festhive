import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  date: String,
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
