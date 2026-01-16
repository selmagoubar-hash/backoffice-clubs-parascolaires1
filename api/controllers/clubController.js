const Club = require('../models/Club');

// @desc    Create a new club
// @route   POST /api/clubs
// @access  Private (Member/President)
exports.createClub = async (req, res) => {
    try {
        const { name, description, logo } = req.body;

        let logoPath = logo; // Default to URL if provided
        if (req.file) {
            logoPath = `/${req.file.path.replace(/\\/g, '/')}`; // Normalize path for browser
        }

        const club = await Club.create({
            name,
            description,
            president: req.user.id,
            status: 'pending',
            logo: logoPath
        });

        res.status(201).json(club);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
exports.getClubs = async (req, res) => {
    try {
        const clubs = await Club.find();
        // The mock populate() and other methods are handled by LocalStorageModel
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single club
// @route   GET /api/clubs/:id
// @access  Public
exports.getClubById = async (req, res) => {
    try {
        const club = await Club.findById(req.params.id).populate('president', 'username email');
        if (!club) return res.status(404).json({ message: 'Club not found' });
        res.json(club);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update club status (BDE only)
// @route   PUT /api/clubs/:id/status
// @access  Private (BDE/Admin)
exports.updateClubStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const club = await Club.findById(req.params.id);

        if (!club) return res.status(404).json({ message: 'Club not found' });

        club.status = status;
        await club.save();

        res.json(club);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
