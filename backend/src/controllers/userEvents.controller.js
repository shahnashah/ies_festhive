// Event Controller - Registration Function
import Event from "../model/event.model.js";
import User from "../model/user.model.js";
import mongoose from "mongoose"

export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id; // Assuming you have authentication middleware that sets req.user
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: "Event not found" 
      });
    }
    
    // Check if user is already registered for this event
    const isAlreadyRegistered = event.registeredUsers && event.registeredUsers.includes(userId);
    if (isAlreadyRegistered) {
      return res.status(400).json({ 
        success: false, 
        message: "You are already registered for this event" 
      });
    }
    
    // Add user to event's registeredUsers
    if (!event.registeredUsers) {
      event.registeredUsers = [userId];
    } else {
      event.registeredUsers.push(userId);
    }
    await event.save();
    
    // Add event to user's events array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    if (!user.events) {
      user.events = [eventId];
    } else if (Array.isArray(user.events)) {
      user.events.push(eventId);
    } else {
      // If events is a single ObjectId, convert to array
      user.events = [user.events, eventId];
    }
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: "Successfully registered for the event",
      data: {
        event: {
          _id: event._id,
          title: event.title
        }
      }
    });
    
  } catch (error) {
    console.error("Error registering for event:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const checkRegistrationStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: "Event not found" 
      });
    }
    
    const isRegistered = event.registeredUsers && event.registeredUsers.includes(userId);
    
    return res.status(200).json({
      success: true,
      isRegistered
    });
    
  } catch (error) {
    console.error("Error checking registration status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Cancel registration for an event
export const cancelEventRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    // Validate that eventId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    // Start a transaction for data consistency
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Remove the event from the user's events array
      const userUpdateResult = await User.updateOne(
        { _id: userId },
        { $pull: { events: eventId } },
        { session }
      );

      // Remove the user from the event's registeredUsers array
      const eventUpdateResult = await Event.updateOne(
        { _id: eventId },
        { $pull: { registeredUsers: userId } },
        { session }
      );

      // If either update failed, throw an error
      if (userUpdateResult.modifiedCount === 0 && eventUpdateResult.modifiedCount === 0) {
        throw new Error("User is not registered for this event");
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({ message: "Registration successfully cancelled" });
    } catch (error) {
      // Abort the transaction in case of any error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error cancelling registration:", error);
    
    if (error.message === "User is not registered for this event") {
      return res.status(404).json({ error: error.message });
    }
    
    return res.status(500).json({ error: "Server error while cancelling registration" });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    // Get the user ID from the authenticated user session
    const userId = req.user._id;
    
    if (!userId) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    // Find the user and populate their events
    const user = await User.findById(userId).select("events").lean();
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all the events the user is registered for with details
    const events = await Event.find({
      _id: { $in: user.events }
    }).lean();

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching user events:", error);
    return res.status(500).json({ error: "Server error while fetching events" });
  }
};