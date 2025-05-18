const express = require('express');
const router = express.Router();
const authAdmin = require('../middlewares/authAdmin');
const eventController = require('../controllers/eventsController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');

// Admin-only event management:
router.post('/', authAdmin, upload.single("image"), eventController.createEvent);
router.delete('/:id', authAdmin, eventController.deleteEventByID);
router.put('/:id/status', authAdmin, eventController.updateEventStatus);


// User-accessible events endpoints:
router.get('/upcoming', authMiddleware, eventController.getUpcomingEvents);
router.get('/live', authMiddleware, eventController.getLiveEvents);
router.get('/:id', eventController.getEventById);

// Public endpoint to get all events
router.get('/', eventController.getAllEvents);

module.exports = router;




