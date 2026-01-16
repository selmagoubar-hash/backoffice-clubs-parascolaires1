const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middlewares/authMiddleware');

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        const Club = require('../models/Club');
        const populatedEvents = await Promise.all(events.map(async e => {
            const club = await Club.findById(e.club);
            return { ...e, club };
        }));
        res.json(populatedEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create event (President only - simplified check)
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, date, location, clubId } = req.body;
        // In real app, check if user is president of this club
        const event = await Event.create({
            title, description, date, location,
            club: clubId
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Register for event
router.post('/:id/register', protect, async (req, res) => {
    try {
        console.log(`Registration attempt for event ID: ${req.params.id} by user: ${req.user.id}`);
        const event = await Event.findById(req.params.id);
        if (!event) {
            console.log('Event NOT found in DB');
            return res.status(404).json({ message: 'Event not found' });
        }
        console.log(`Event found: ${event.title}`);

        // Robust check for existing registration
        const userId = req.user.id;
        const alreadyRegistered = event.attendees.some(att => att.toString() === userId);

        if (alreadyRegistered) {
            return res.status(400).json({ message: 'You are already registered for this event' });
        }

        event.attendees.push(userId);
        await event.save();

        res.json({
            message: 'Registered successfully',
            attendeesCount: event.attendees.length,
            attendees: event.attendees
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration: ' + error.message });
    }
});

module.exports = router;
