const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');
const Club = require('../models/Club');
const { protect } = require('../middlewares/authMiddleware');

// @desc    Join a club (Request membership)
// @route   POST /api/members/join
router.post('/join', protect, async (req, res) => {
    try {
        const { clubId } = req.body;

        // Check if already a member
        const existing = await Membership.findOne({ user: req.user.id, club: clubId });
        if (existing) {
            return res.status(400).json({ message: 'Membership request already exists' });
        }

        const membership = await Membership.create({
            user: req.user.id,
            club: clubId,
            status: 'pending'
        });

        res.status(201).json(membership);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get members of a club (for President/Admin)
// @route   GET /api/members/club/:clubId
router.get('/club/:clubId', protect, async (req, res) => {
    try {
        // In a real app, verify req.user is president of clubId or admin
        const members = await Membership.find({ club: req.params.clubId });
        // Manual populate for user
        const User = require('../models/User');
        const populatedMembers = await Promise.all(members.map(async m => {
            const user = await User.findById(m.user);
            return { ...m, user };
        }));
        res.json(populatedMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update membership status (approve/reject/ban)
// @route   PUT /api/members/:id/status
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const membership = await Membership.findById(req.params.id);

        if (!membership) return res.status(404).json({ message: 'Membership not found' });

        const Club = require('../models/Club');
        const club = await Club.findById(membership.club);
        if (!club) return res.status(404).json({ message: 'Club not found for this membership' });

        // Check if user is admin OR president of the club
        const isPresident = club.president && club.president.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isPresident && !isAdmin) {
            return res.status(403).json({
                message: 'Not authorized to manage members for this club'
            });
        }

        membership.status = status;
        await membership.save();
        res.json(membership);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
