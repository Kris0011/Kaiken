const Trade = require('../models/Trade');
const Event = require('../models/Event');
const User = require('../models/User');
const { getWebSocketInstance } = require('../config/socket');
const WebSocket = require('ws'); // Make sure WebSocket is imported if you're using it

exports.createTrade = async (req, res) => {
    try {
        console.log("Creating trade with data:", req.body);
        const user = req.user;
        console.log("User ID:", user);
        const event = req.body.eventId;
        const selection = req.body.prediction;
        const { amount } = req.body;

        if (!user || !event || !amount || !selection) {
            return res.status(400).json({ message: "user, eventId, amount, and prediction are required" });
        }

        if (!["yes", "no"].includes(selection)) {
            return res.status(400).json({ message: "Invalid prediction. Must be 'yes' or 'no'." });
        }

        const eventData = await Event.findById(event);
        if (!eventData) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (eventData.status === "resolved") {
            return res.status(400).json({ message: "Cannot place trades on completed events" });
        }

        // Get current market price for YES
        let currentYesPrice = eventData.currentYesPrice || 0.5;

        // Calculate NO price as complement
        let currentNoPrice = 1 - currentYesPrice;

        // Use the market price for the selected side
        const price = selection === "yes" ? currentYesPrice : currentNoPrice;

        // Ensure price is valid and not 0
        if (price <= 0 || price >= 1) {
            return res.status(400).json({ message: "Invalid market price. Please try again later." });
        }

        // Create the trade with price snapshot
        const trade = new Trade({
            user,
            event,
            amount,
            selection,
            price,
            status: "pending"
        });

        await trade.save();

        // Update event volumes
        if (selection === "yes") {
            eventData.totalYesVolume += amount;
        } else {
            eventData.totalNoVolume += amount;
        }

        // Recalculate market price for YES side
        const totalVolume = eventData.totalYesVolume + eventData.totalNoVolume;
        let newYesPrice = totalVolume === 0 ? 0.5 : eventData.totalYesVolume / totalVolume;

        // Clamp price to avoid 0 or 1
        newYesPrice = Math.max(0.01, Math.min(0.99, newYesPrice));
        eventData.currentYesPrice = newYesPrice;

        await eventData.save();

        // Notify all connected clients with updated event and trade
        const wss = getWebSocketInstance();
        if (wss && wss.clients) {
            const payload = JSON.stringify({
                event: "Trade Created",
                trade,
                updatedEvent: {
                    id: eventData._id,
                    currentYesPrice: eventData.currentYesPrice,
                    totalYesVolume: eventData.totalYesVolume,
                    totalNoVolume: eventData.totalNoVolume,
                }
            });

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(payload);
                }
            });
        }

        res.status(201).json({ message: "Trade created successfully", trade, currentYesPrice: eventData.currentYesPrice });
    } catch (error) {
        console.error("Error creating trade:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.getAllTrades = async (req, res) => {
    try {
        const { user, status } = req.query;
        let query = {};

        if (user) query.user = user;
        if (status) query.status = status;

        const trades = await Trade.find(query)
            .lean()
            .populate({
                path: 'user',
                select: 'username email'
            })
            .populate({
                path: 'event',
                select: 'name _id'
            });

        // Map event to only include eventId and eventName
        const result = trades.map(trade => ({
            ...trade,
            eventId: trade.event ? trade.event._id : null,
            eventName: trade.event ? trade.event.name : null,
            username: trade.user ? trade.user.username : null,
        }));

        // console.log("Fetched trades:", result);

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTradeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'won', 'lost'].includes(status)) {
            return res.status(400).json({ message: "Invalid trade status" });
        }

        const trade = await Trade.findByIdAndUpdate(id, { status }, { new: true });

        if (!trade) {
            return res.status(404).json({ message: "Trade not found" });
        }

        const wss = getWebSocketInstance();
        if (wss && wss.clients) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ event: "Trade Updated Successfully", trade }));
                }
            });
        }

        res.json({ message: "Trade status updated successfully", trade });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserTrades = async (req, res) => {
    try {
        const userId = req.user._id;
        const trades = await Trade.find({ user: userId }).lean().populate({
            path: 'event',
            select: 'name _id'
        });
        // Map event to only include eventId and eventName
        const result = trades.map(trade => ({
            ...trade,
            eventId: trade.event ? trade.event._id : null,
            eventName: trade.event ? trade.event.name : null
        }));

        // console.log("Fetched trades:", result);

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
