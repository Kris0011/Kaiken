const express = require('express');
const authAdmin = require('../middlewares/authAdmin');
const authorizeRoles = require('../middlewares/authorizeRoles');
const tradeController = require('../controllers/tradeController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles('user', 'admin'), tradeController.createTrade);
router.get('/', authAdmin, tradeController.getAllTrades);

// User-specific trade endpoint
router.get('/mytrades', authMiddleware, tradeController.getUserTrades);

router.put('/:id', authAdmin, tradeController.updateTradeStatus);


module.exports = router;
