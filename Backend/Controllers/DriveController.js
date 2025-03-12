// controllers/DriveController.js
import { v4 as uuidv4 } from 'uuid';
import Drive from '../models/Drive.js';
import User from '../models/User.js';
import { bucket } from '../config/firebase.js';

export const uploadEventImage = async (fileBuffer, fileName, folderPath, mimeType) => {
  const finalFileName = `${folderPath}/${fileName}_${uuidv4()}`;
  const file = bucket.file(finalFileName);
  await file.save(fileBuffer, {
    metadata: { contentType: mimeType },
    public: true,
  });
  return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, createdBy, role } = req.body;
    if (role !== 'owner') {
      return res.status(403).json({ error: `${role} Only owners can create events` });
    }
    
    let imageUrl = "";
    if (req.file) {
      const folderPath = `Event_Information`;
      const fileName = title.replace(/\s+/g, '_');
      imageUrl = await uploadEventImage(req.file.buffer, fileName, folderPath, req.file.mimetype);
    }
    
    const newEvent = await Drive.create({
      title,
      description,
      startDate,
      endDate,
      location,
      imageUrl,
      createdBy,
      role,
      participants: [],
    });
    
    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Drive.find().populate('createdBy', 'name email');
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const participateInEvent = async (req, res) => {
  try {
    const { userId } = req.body;
    const eventId = req.params.id;
    
    const event = await Drive.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    if (event.participants.includes(userId)) {
      return res.status(400).json({ error: 'User already participating' });
    }
    
    event.participants.push(userId);
    await event.save();

    const user = await User.findById(userId);
    if (user) {
      user.points = (user.points || 0) + 1;
      await user.save();
    }

    res.json({ message: 'Participation successful', event });
  } catch (error) {
    console.error('Error in participation:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updateData = req.body;
    const updatedEvent = await Drive.findByIdAndUpdate(eventId, updateData, { new: true });
    
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Server error' });
  }
};