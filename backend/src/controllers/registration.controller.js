import mongoose from 'mongoose';
import User from '../model/registration.model.js';

export const registerForEvent = async (req, res) => {
  try {
    const { fullName, email, mobile, branch, enrollment, eventId } = req.body;

    // Convert eventId string to mongoose ObjectId
    const eventObjectId =new mongoose.Types.ObjectId(eventId);

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ fullName, email, mobile, branch, enrollment, events: [eventObjectId] });
    } else {
      if (user.events.includes(eventObjectId)) {
        return res.status(400).json({ message: 'Already registered for this event.' });
      }
      user.events.push(eventObjectId);
    }

    await user.save();
    res.status(200).json({ message: 'Registered successfully', user });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
