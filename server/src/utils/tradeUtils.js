const Trade = require('../models/Trade');
const User = require('../models/User');
const { getWebSocketInstance } = require('../config/socket');

const executeTrades = async (eventId, winningOutcome) => {
    try {
        // Fetch all unpaid trades for the event
        const trades = await Trade.find({
            event: eventId,
            paidOut: { $ne: true } // In case old trades don’t have paidOut field
        }).populate('user');

        if (!trades.length) return;

        const bulkTradeUpdates = [];
        const bulkUserUpdates = [];

        for (const trade of trades) {
            const isWin = trade.selection === winningOutcome;
            const status = isWin ? 'won' : 'lost';
            let payout = 0;

            if (isWin) {
                // Calculate payout based on side
                payout = trade.selection === 'yes'
                    ? trade.amount / trade.price
                    : trade.amount / (1 - trade.price);

                // Update user's balance
                bulkUserUpdates.push({
                    updateOne: {
                        filter: { _id: trade.user._id },
                        update: { $inc: { balance: payout } }
                    }
                });
            }

            // Mark trade as completed
            bulkTradeUpdates.push({
                updateOne: {
                    filter: { _id: trade._id },
                    update: {
                        $set: {
                            status,
                            paidOut: true
                        }
                    }
                }
            });
        }

        if (bulkTradeUpdates.length) await Trade.bulkWrite(bulkTradeUpdates);
        if (bulkUserUpdates.length) await User.bulkWrite(bulkUserUpdates);

        // WebSocket notify
        const wss = getWebSocketInstance();
        if (wss && wss.clients) {
            for (const trade of trades) {
                const newStatus = trade.selection === winningOutcome ? 'won' : 'lost';

                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            event: 'tradeUpdated',
                            tradeId: trade._id,
                            status: newStatus
                        }));
                    }
                });
            }
        }

    } catch (error) {
        console.error('Error executing trades:', error);
    }
};

module.exports = { executeTrades };
