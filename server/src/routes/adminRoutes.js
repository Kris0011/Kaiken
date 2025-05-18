const express = require('express');
const router = express.Router();
const authAdmin = require('../middlewares/authAdmin');
const eventController = require('../controllers/eventsController');
// const adminController = require('../controllers/adminController');
// const authorizeRoles = require('../middlewares/authorizeRoles');
// const { authenticateUser } = require('../middlewares/authMiddleware');
// const { updateEventStatus } = require('../controllers/eventsController');



// router.get('/fetchlivedata', authAdmin, adminController.fetchLiveData);
router.put('/events/:id/status', authAdmin, eventController.updateEventStatus);


module.exports = router;
