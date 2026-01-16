const express = require('express');
const router = express.Router();
const { createClub, getClubs, getClubById, updateClubStatus } = require('../controllers/clubController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/')
    .get(getClubs);

// @route   POST /api/clubs
// @desc    Create a club
// @access  Private
router.post('/', protect, upload.single('logo'), createClub);

router.route('/:id')
    .get(getClubById);

router.route('/:id/status')
    .put(protect, authorize('bde', 'admin'), updateClubStatus);

module.exports = router;
